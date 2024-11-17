package de.niklaskerkhoff.tutorassistantappservice.modules.calendar.entities

import jakarta.persistence.Column
import jakarta.persistence.Embeddable

@Embeddable
data class CalendarEntry(
    @Column(length = 1023)
    val title: String,
    val date: String,
    val time: String?,
)
