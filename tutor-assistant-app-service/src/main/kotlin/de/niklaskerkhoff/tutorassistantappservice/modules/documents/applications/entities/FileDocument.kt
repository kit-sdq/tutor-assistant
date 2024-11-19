package de.niklaskerkhoff.tutorassistantappservice.modules.documents.applications.entities

import jakarta.persistence.Entity
import java.util.UUID

@Entity
class FileDocument(
    title: String,
    loaderType: String,
    collection: String?,
    isCalendar: Boolean,
    val fileStoreId: UUID,
    val fileStoreUrl: String,
) : Document(title, loaderType, collection, isCalendar) {
    override fun accept(visitor: DocumentVisitor) {
        visitor.visit(this)
    }
}
