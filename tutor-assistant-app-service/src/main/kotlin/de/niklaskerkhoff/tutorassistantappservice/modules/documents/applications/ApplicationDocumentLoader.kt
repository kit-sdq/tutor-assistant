package de.niklaskerkhoff.tutorassistantappservice.modules.documents.applications

import de.niklaskerkhoff.tutorassistantappservice.modules.documents.applications.entities.Document

interface ApplicationDocumentLoader {
    fun loadDocuments(): List<Document>
}