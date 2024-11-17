package de.niklaskerkhoff.tutorassistantappservice.modules.chat.model.messages

import de.niklaskerkhoff.tutorassistantappservice.lib.entities.AppEntity
import jakarta.persistence.Column
import jakarta.persistence.ElementCollection
import jakarta.persistence.Entity

@Entity
class Message(
    val role: String,
    @Column(columnDefinition = "text")
    val content: String,
    @ElementCollection
    val contexts: List<MessageContext>? = null,
    var feedback: MessageFeedback = MessageFeedback(0, "")
) : AppEntity()
