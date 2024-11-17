package de.niklaskerkhoff.tutorassistantappservice.modules.chat.model

import de.niklaskerkhoff.tutorassistantappservice.lib.entities.AppEntity
import de.niklaskerkhoff.tutorassistantappservice.modules.chat.model.messages.Message
import jakarta.persistence.*
import java.util.*

@Entity
class Chat(
    val userId: String,
    @Embedded
    var summary: ChatSummary? = null,
) : AppEntity() {

    @OneToMany(orphanRemoval = true)
    @OrderBy("createdDate ASC")
    private val _messages = mutableListOf<Message>()

    @get:OneToMany
    val messages: List<Message> get() = _messages.toList()

    fun addMessage(message: Message) = _messages.add(message)
    fun removeMessage(messageId: UUID) = _messages.removeIf { it.id == messageId }
}
