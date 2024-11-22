package de.niklaskerkhoff.tutorassistantappservice.modules.chat.model.messages

import jakarta.persistence.Column
import jakarta.persistence.Embeddable

@Embeddable
data class MessageContext(
    val tutorAssistantId: String?,
    val title: String?,
    val originalKey: String?,
    val isCalendar: Boolean?,
    val heading: String?,
    val page: Int?,
    @Column(columnDefinition = "text")
    val content: String?,
    val score: Double?
)
