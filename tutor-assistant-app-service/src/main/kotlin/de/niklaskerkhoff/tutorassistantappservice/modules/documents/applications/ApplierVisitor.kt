package de.niklaskerkhoff.tutorassistantappservice.modules.documents.applications

import de.niklaskerkhoff.tutorassistantappservice.lib.logging.Logger
import de.niklaskerkhoff.tutorassistantappservice.modules.documents.TutorAssistantDocumentService
import de.niklaskerkhoff.tutorassistantappservice.modules.documents.applications.entities.*
import org.springframework.stereotype.Component

@Component
class ApplierVisitor(
    private val fileDocumentRepo: FileDocumentRepo,
    private val websiteDocumentRepo: WebsiteDocumentRepo,
    private val tutorAssistantDocumentService: TutorAssistantDocumentService
) : DocumentVisitor, Logger {

    override fun visit(fileDocument: FileDocument) {
        log.info("Visiting fileDocument with title ${fileDocument.title}")

        val existing = fileDocumentRepo.findByTitle(fileDocument.title)
        if (existing != null) {
            logStopping(fileDocument.title)
            return
        }

        logContinuing(fileDocument.title)

        val loaderParams = mapOf("url" to fileDocument.fileStoreUrl)

        val tutorAssistantIds = tutorAssistantDocumentService.addDocument(
            fileDocument.title,
            fileDocument.fileStoreId.toString(),
            fileDocument.loaderType,
            loaderParams
        ).also {
            logAddedToTutorAssistant(fileDocument.title, it)
        }

        fileDocument.tutorAssistantIds = tutorAssistantIds

        fileDocumentRepo.save(fileDocument).also {
            logSaved(it.title)
        }
    }

    override fun visit(websiteDocument: WebsiteDocument) {
        log.info("Visiting websiteDocument with title ${websiteDocument.title}")

        val existing = websiteDocumentRepo.findByTitle(websiteDocument.title)
        if (existing != null) {
            logStopping(websiteDocument.title)
            return
        }

        logContinuing(websiteDocument.title)

        val loaderParams = mapOf(
            "url" to websiteDocument.loaderParams.url,
            "htmlSelector" to websiteDocument.loaderParams.htmlSelector,
            "htmlSelectionIndex" to websiteDocument.loaderParams.htmlSelectionIndex,
        )

        val tutorAssistantIds = tutorAssistantDocumentService.addDocument(
            websiteDocument.title,
            websiteDocument.loaderParams.url,
            websiteDocument.loaderType,
            loaderParams
        ).also {
            logAddedToTutorAssistant(websiteDocument.title, it)
        }

        websiteDocument.tutorAssistantIds = tutorAssistantIds

        websiteDocumentRepo.save(websiteDocument).also {
            logSaved(websiteDocument.title)
        }
    }

    private fun logContinuing(title: String) {
        log.info("$title does not exist, continuing")
    }

    private fun logStopping(title: String) {
        log.info("$title already exists, stopping")
    }

    private fun logAddedToTutorAssistant(title: String, tutorAssistantIds: List<String>) {
        log.info("Added $title to Tutor-Assistant, got ${tutorAssistantIds.size} ids")
    }

    private fun logSaved(title: String) {
        log.info("Saved $title")
    }
}
