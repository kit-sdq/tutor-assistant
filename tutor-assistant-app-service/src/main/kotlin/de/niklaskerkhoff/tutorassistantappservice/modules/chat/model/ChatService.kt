package de.niklaskerkhoff.tutorassistantappservice.modules.chat.model

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import de.niklaskerkhoff.tutorassistantappservice.lib.app_components.AppService
import de.niklaskerkhoff.tutorassistantappservice.lib.entities.findByIdOrThrow
import de.niklaskerkhoff.tutorassistantappservice.modules.chat.model.messages.Message
import de.niklaskerkhoff.tutorassistantappservice.modules.chat.model.messages.MessageContext
import de.niklaskerkhoff.tutorassistantappservice.modules.chat.model.messages.MessageRepo
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.jackson.*
import kotlinx.coroutines.runBlocking
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.server.ResponseStatusException
import reactor.core.publisher.Flux
import java.util.*

@Suppress("BlockingMethodInNonBlockingContext")
@Service
class ChatService(
    private val messageRepo: MessageRepo,
    private val chatRepo: ChatRepo,
    private val webClient: WebClient,
    private val objectMapper: ObjectMapper,
) : AppService() {
    private companion object {
        const val EVENT_STREAM_END = "=====END====="
        const val MESSAGE_END = "=====MESSAGE_END====="
        const val CONTEXT_TOKEN_START = "##########context:"
    }

    @Value("\${app.tutor-assistant.base-url}")
    private lateinit var baseUrl: String

    fun getChats(userId: String) = chatRepo.findByUserIdOrderByCreatedDateDesc(userId).map { ChatBaseData(it) }

    fun getChatById(chatId: UUID, userId: String): ChatMainData {
        val chat = chatRepo.findByIdOrThrow(chatId).requireUser(userId)
        return ChatMainData(chat)
    }

    fun createChat(userId: String): ChatBaseData {
        val chat = chatRepo.save(Chat(userId)).also {
            log.info("Created chat: ${it.id}")
        }
        return ChatBaseData(chat)
    }

    fun deleteChat(chatId: UUID, userId: String) {
        val chat = chatRepo.findByIdOrThrow(chatId).requireUser(userId)
        chatRepo.delete(chat).also {
            log.info("Deleted chat: $chatId")
        }
    }

    @Transactional
    fun sendMessage(chatId: UUID, message: String, userId: String): Flux<String> {
        val chat = chatRepo.findByIdOrThrow(chatId).requireUser(userId)
        return handleMessageSending(chat, message)
    }

    private fun handleMessageSending(chat: Chat, message: String): Flux<String> {
        val userMessage = Message("user", message)
        chat.addMessage(userMessage)

        /*mono(Dispatchers.IO) {
            messageRepo.save(userMessage)
            chatRepo.save(chat)
        }*/

        messageRepo.save(userMessage).also {
            log.info("Created user-message: ${it.id} for chat: ${chat.id}")
        }

        chatRepo.save(chat).also {
            log.info("Updated chat: ${it.id} with user-message: ${userMessage.id}")
        }

        return loadAiMessage(chat, message)
            .concatWith(Flux.just(MESSAGE_END))
            .concatWith(loadChatSummary(chat))
            .concatWith(Flux.just(EVENT_STREAM_END))
    }

    private fun loadAiMessage(chat: Chat, message: String): Flux<String> {
        val dataToPost = mapOf(
            "message" to message,
            "history" to chat.messages.map {
                mapOf(
                    "role" to it.role,
                    "content" to it.content,
                )
            }
        )

        val contexts = mutableListOf<MessageContext>()
        var answer = ""

        return webClient
            .post()
            .uri("$baseUrl/chats/message")
            .bodyValue(dataToPost)
            .retrieve()
            .bodyToFlux(String::class.java)
            .map {
                val unquotedToken = it.drop(1).dropLast(1)

                if (unquotedToken.startsWith(CONTEXT_TOKEN_START)) {
                    val cleanedToken = unquotedToken.drop(CONTEXT_TOKEN_START.length)
                    contexts.add(getContextFromJson(cleanedToken))
                    ""
                } else {
                    val cleanedToken = unquotedToken.replace("\\n", "\n")
                    answer += cleanedToken
                    "\"$cleanedToken\""
                }

            }
            .doOnSubscribe {
                log.info("Started loading ai-message in chat: ${chat.id}")
            }
            .doOnComplete {
                val aiMessage = Message("ai", answer, contexts)
                chat.addMessage(aiMessage)
                messageRepo.save(aiMessage).also {
                    log.info("Created aiMessage: ${it.id} for chat: ${chat.id}")
                }
                chatRepo.save(chat).also {
                    log.info("Updated chat: ${it.id} with ai-message: ${aiMessage.id}")
                }
            }
    }

    private fun loadChatSummary(chat: Chat): Flux<String> {
        return Flux.defer {
            log.info("Started loading chat summary in chat: ${chat.id}")
            runBlocking {
                val client = HttpClient {
                    install(ContentNegotiation) {
                        jackson {
                            registerModule(JavaTimeModule())
                        }
                    }
                }

                val response = client.use {
                    client.post("$baseUrl/chats/summarize") {
                        contentType(ContentType.Application.Json)
                        setBody(mapOf("history" to chat.messages))
                    }
                }

                chat.summary = response.body()
                chatRepo.save(chat).also {
                    log.info("Updated chat: ${it.id} with summary")
                }
            }
            Flux.empty()
        }
    }

    private fun getContextFromJson(json: String): MessageContext {
        val root = objectMapper.readTree(json)
        return MessageContext(
            tutorAssistantId = root.getOrNull("kwargs").getOrNull("metadata").getOrNull("tutorAssistantId")?.asText(),
            title = root.getOrNull("kwargs").getOrNull("metadata").getOrNull("title")?.asText(),
            originalKey = root.getOrNull("kwargs").getOrNull("metadata").getOrNull("originalKey")?.asText(),
            isCalendar = root.getOrNull("kwargs").getOrNull("metadata").getOrNull("isCalendar")?.asBoolean(),
            heading = root.getOrNull("kwargs").getOrNull("metadata").getOrNull("heading")?.asText(),
            page = root.getOrNull("kwargs").getOrNull("metadata").getOrNull("page")?.asInt(),
            content = root.getOrNull("kwargs").getOrNull("page_content")?.asText(),
            score = root.getOrNull("kwargs").getOrNull("metadata").getOrNull("score")?.asDouble(),
        )
    }

    private fun JsonNode?.getOrNull(key: String): JsonNode? {
        return if (this?.has(key) == true) this[key] else null
    }

    private fun Chat.requireUser(userId: String): Chat {
        if (this.userId != userId) throw ResponseStatusException(HttpStatus.NOT_FOUND)
        return this
    }
}
