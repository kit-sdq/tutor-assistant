package de.niklaskerkhoff.tutorassistantappservice.modules.documents.applications

import de.niklaskerkhoff.tutorassistantappservice.modules.documents.applications.entities.toDto
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("documents/applications")
class ApplicationController(
    private val applicationService: ApplicationService
) {
    @GetMapping("files")
    fun getFileDocuments() = applicationService.getFileDocuments().map { it.toDto() }

    @GetMapping("websites")
    fun getWebsiteDocuments() = applicationService.getWebsiteDocuments().map { it.toDto() }

    @PostMapping("index")
    @PreAuthorize("hasRole('document-manager')")
    fun index(): Unit = applicationService.index()

    @PostMapping("files/{id}/reindex")
    @PreAuthorize("hasRole('document-manager')")
    fun reindexFile(@PathVariable id: UUID): Unit = applicationService.reindexFileDocument(id)

    @PostMapping("websites/{id}/reindex")
    @PreAuthorize("hasRole('document-manager')")
    fun reindexWebsite(@PathVariable id: UUID): Unit = applicationService.reindexWebsiteDocument(id)

    @DeleteMapping("files/{id}")
    @PreAuthorize("hasRole('document-manager')")
    fun deleteFile(@PathVariable id: UUID): Unit = applicationService.deleteFileDocument(id)

    @DeleteMapping("websites/{id}")
    @PreAuthorize("hasRole('document-manager')")
    fun deleteWebsite(@PathVariable id: UUID): Unit = applicationService.deleteWebsiteDocument(id)
}
