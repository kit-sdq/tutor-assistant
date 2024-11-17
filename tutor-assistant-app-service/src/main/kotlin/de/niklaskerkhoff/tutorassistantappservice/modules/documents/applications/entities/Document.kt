package de.niklaskerkhoff.tutorassistantappservice.modules.documents.applications.entities

import de.niklaskerkhoff.tutorassistantappservice.lib.entities.AppEntity
import jakarta.persistence.ElementCollection
import jakarta.persistence.Entity
import jakarta.persistence.Inheritance
import jakarta.persistence.InheritanceType

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
abstract class Document(
    open val title: String,
    open val loaderType: String,
    open val collection: String?
) : AppEntity() {
    @ElementCollection
    open var tutorAssistantIds: List<String> = emptyList()

    abstract fun accept(visitor: DocumentVisitor)
}
