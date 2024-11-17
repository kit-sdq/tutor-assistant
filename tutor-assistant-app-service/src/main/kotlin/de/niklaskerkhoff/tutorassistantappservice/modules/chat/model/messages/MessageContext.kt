package de.niklaskerkhoff.tutorassistantappservice.modules.chat.model.messages

import jakarta.persistence.Column
import jakarta.persistence.Embeddable

@Embeddable
data class MessageContext(
    val source: String?,
    val page: Int?,
    @Column(columnDefinition = "text")
    val content: String?,
    val originalKey: String?
)
