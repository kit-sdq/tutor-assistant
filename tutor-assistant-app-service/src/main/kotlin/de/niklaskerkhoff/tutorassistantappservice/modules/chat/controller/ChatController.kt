package de.niklaskerkhoff.tutorassistantappservice.modules.chat.controller

import de.niklaskerkhoff.tutorassistantappservice.lib.app_components.AppController
import de.niklaskerkhoff.tutorassistantappservice.modules.chat.model.ChatBaseData
import de.niklaskerkhoff.tutorassistantappservice.modules.chat.model.ChatMainData
import de.niklaskerkhoff.tutorassistantappservice.modules.chat.model.ChatService
import org.springframework.http.CacheControl
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import java.util.*

@RestController
@RequestMapping("chats")
class ChatController(
    private val chatService: ChatService
) : AppController() {
    @GetMapping("{chatId}")
    fun getChatById(@PathVariable chatId: UUID, jwt: JwtAuthenticationToken): ChatMainData =
        chatService.getChatById(chatId, jwt.name)

    @GetMapping
    fun getChats(jwt: JwtAuthenticationToken): List<ChatBaseData> = chatService.getChats(jwt.name)

    @PostMapping
    fun createChat(jwt: JwtAuthenticationToken): ChatBaseData = chatService.createChat(jwt.name)

    @DeleteMapping("{chatId}")
    fun deleteChat(@PathVariable chatId: UUID, jwt: JwtAuthenticationToken): Unit =
        chatService.deleteChat(chatId, jwt.name)

    @PostMapping("{chatId}/messages", produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
    fun sendMessageToExistingChat(
        @PathVariable chatId: UUID,
        @RequestBody message: String,
        jwt: JwtAuthenticationToken
    ): ResponseEntity<Flux<String>> {
        val flux = chatService.sendMessage(chatId, message, jwt.name)
        val headers = HttpHeaders().apply {
            contentType = MediaType.TEXT_EVENT_STREAM
            cacheControl = CacheControl.noCache().headerValue
            this["X-Accel-Buffering"] = "no"
        }

        return ResponseEntity.ok().headers(headers).body(flux)
    }
}
