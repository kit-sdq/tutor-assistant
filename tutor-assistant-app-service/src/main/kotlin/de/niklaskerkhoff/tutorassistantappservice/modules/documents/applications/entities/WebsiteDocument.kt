package de.niklaskerkhoff.tutorassistantappservice.modules.documents.applications.entities

import jakarta.persistence.Embeddable
import jakarta.persistence.Entity

@Entity
class WebsiteDocument(
    title: String,
    loaderType: String,
    collection: String?,
    val loaderParams: LoaderParams,
) : Document(title, loaderType, collection) {
    override fun accept(visitor: DocumentVisitor) {
        visitor.visit(this)
    }

    @Embeddable
    data class LoaderParams(
        val url: String,
        val htmlSelector: String,
        val htmlSelectionIndex: Int
    )
}
