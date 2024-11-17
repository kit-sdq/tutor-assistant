package de.niklaskerkhoff.tutorassistantappservice.modules.documents.applications.entities

import java.util.UUID

data class FileDocumentDto(
    val id: UUID?,
    val title: String,
    val loaderType: String,
    val collection: String?,
) {
    constructor(fileDocument: FileDocument) : this(
        id = fileDocument.id,
        title = fileDocument.title,
        loaderType = fileDocument.loaderType,
        collection = fileDocument.collection
    )
}

fun FileDocument.toDto() = FileDocumentDto(this)
