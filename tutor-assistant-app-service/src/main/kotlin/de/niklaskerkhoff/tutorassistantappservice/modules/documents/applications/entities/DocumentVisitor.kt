package de.niklaskerkhoff.tutorassistantappservice.modules.documents.applications.entities

interface DocumentVisitor {
    fun visit(fileDocument: FileDocument)
    fun visit(websiteDocument: WebsiteDocument)
}
