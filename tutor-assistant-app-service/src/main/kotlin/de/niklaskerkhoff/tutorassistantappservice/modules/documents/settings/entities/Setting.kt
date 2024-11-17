package de.niklaskerkhoff.tutorassistantappservice.modules.documents.settings.entities

import de.niklaskerkhoff.tutorassistantappservice.lib.entities.AppEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity

@Entity
class Setting(
    val name: String,
    @Column(columnDefinition = "text")
    val content: String,
    val type: SettingType
) : AppEntity()
