package de.niklaskerkhoff.tutorassistantappservice.modules.chat.model.messages

import jakarta.persistence.Column
import jakarta.persistence.Embeddable

@Embeddable
data class MessageFeedback(
    val rating: Int,
    @Column(name = "feedback_content", columnDefinition = "text")
    val content: String
)
