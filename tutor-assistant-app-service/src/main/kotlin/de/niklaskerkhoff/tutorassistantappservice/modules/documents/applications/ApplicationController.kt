package de.niklaskerkhoff.tutorassistantappservice.modules.documents.applications

import de.niklaskerkhoff.tutorassistantappservice.modules.documents.applications.entities.toDto
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
    fun index(): Unit = applicationService.index()

    @PostMapping("files/{id}/reindex")
    fun reindexFile(@PathVariable id: UUID): Unit = applicationService.reindexFileDocument(id)

    @PostMapping("websites/{id}/reindex")
    fun reindexWebsite(@PathVariable id: UUID): Unit = applicationService.reindexWebsiteDocument(id)

    @DeleteMapping("files/{id}")
    fun deleteFile(@PathVariable id: UUID): Unit = applicationService.deleteFileDocument(id)

    @DeleteMapping("websites/{id}")
    fun deleteWebsite(@PathVariable id: UUID): Unit = applicationService.deleteWebsiteDocument(id)
}
