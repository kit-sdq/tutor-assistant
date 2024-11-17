package de.niklaskerkhoff.tutorassistantappservice.modules.calendar.entities

import de.niklaskerkhoff.tutorassistantappservice.lib.entities.AppEntity
import jakarta.persistence.ElementCollection
import jakarta.persistence.Entity

@Entity
class Calendar(
    @ElementCollection
    val entries: List<CalendarEntry>
) : AppEntity()
