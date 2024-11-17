package de.niklaskerkhoff.tutorassistantappservice.modules.documents.applications

import de.niklaskerkhoff.tutorassistantappservice.lib.app_components.AppService
import de.niklaskerkhoff.tutorassistantappservice.lib.entities.findByIdOrThrow
import de.niklaskerkhoff.tutorassistantappservice.lib.exceptions.BadRequestException
import de.niklaskerkhoff.tutorassistantappservice.modules.documents.TutorAssistantDocumentService
import de.niklaskerkhoff.tutorassistantappservice.modules.documents.applications.entities.*
import org.springframework.stereotype.Service
import java.util.*

@Service
class ApplicationService(
    private val fileDocumentRepo: FileDocumentRepo,
    private val websiteDocumentRepo: WebsiteDocumentRepo,
    private val applicationDocumentLoader: ApplicationDocumentLoader,
    private val applierVisitor: ApplierVisitor,
    private val tutorAssistantDocumentService: TutorAssistantDocumentService
) : AppService() {

    fun getFileDocuments(): List<FileDocument> = fileDocumentRepo.findAll()

    fun getWebsiteDocuments(): List<WebsiteDocument> = websiteDocumentRepo.findAll()

    fun index() {
        val documents = applicationDocumentLoader.loadDocuments()
        documents.forEach { it.accept(applierVisitor) }
    }

    fun reindexFileDocument(id: UUID) = reindex(id, fileDocumentRepo)

    fun reindexWebsiteDocument(id: UUID) = reindex(id, websiteDocumentRepo)

    fun deleteFileDocument(id: UUID) = delete(id, fileDocumentRepo)

    fun deleteWebsiteDocument(id: UUID) = delete(id, websiteDocumentRepo)

    private fun <T : Document> reindex(id: UUID, documentRepo: DocumentRepo<T>) {
        val existingDocument = documentRepo.findByIdOrThrow(id)
        val title = existingDocument.title
        val allDocuments = applicationDocumentLoader.loadDocuments()
        val documentToReindex = allDocuments.find { it.title == title }
            ?: throw BadRequestException("Document $title not specified in main settings")

        delete(existingDocument, documentRepo)
        documentToReindex.accept(applierVisitor)
    }

    private fun <T : Document> delete(id: UUID, documentRepo: DocumentRepo<T>) {
        val document = documentRepo.findByIdOrThrow(id)
        delete(document, documentRepo)
    }

    private fun <T : Document> delete(document: T, documentRepo: DocumentRepo<T>) {
        tutorAssistantDocumentService.deleteDocument(document.tutorAssistantIds).also {
            log.info("Deleted ${document.tutorAssistantIds} from Tutor-Assistant")
        }
        documentRepo.delete(document).also {
            log.info("Deleted document with id ${document.id}")
        }
    }
}
