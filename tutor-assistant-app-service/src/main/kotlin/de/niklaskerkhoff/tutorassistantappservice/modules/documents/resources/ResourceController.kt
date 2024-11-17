package de.niklaskerkhoff.tutorassistantappservice.modules.documents.resources

import de.niklaskerkhoff.tutorassistantappservice.lib.filestore.FileStoreFileReferenceDto
import de.niklaskerkhoff.tutorassistantappservice.lib.filestore.FileStoreService
import de.niklaskerkhoff.tutorassistantappservice.lib.filestore.toDto
import org.springframework.core.io.InputStreamResource
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.util.*

@RestController
@RequestMapping("documents/resources")
class ResourceController(
    private val resourceService: ResourceService,
    private val fileStoreService: FileStoreService
) {
    companion object {
        private val CONTENT_TYPES = mapOf(
            "pdf" to MediaType.APPLICATION_PDF,
        )
        private val DEFAULT_CONTENT_TYPE = MediaType.TEXT_PLAIN
    }

    @GetMapping
    fun listFiles(): List<FileStoreFileReferenceDto> = fileStoreService.listFiles().map { it.toDto() }

    @GetMapping("{id}")
    fun getFile(@PathVariable id: UUID): ResponseEntity<InputStreamResource> {
        val fileData = fileStoreService.getFileById(id)
        val fileType = fileData.first.displayName.split(".").last()

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"${fileData.first.displayName}\"")
            .contentType(CONTENT_TYPES[fileType] ?: DEFAULT_CONTENT_TYPE)
            .body(fileData.second)
    }

    @PostMapping
    @PreAuthorize("hasRole('document-manager')")
    fun addFile(
        @RequestPart("file") file: MultipartFile,
    ): FileStoreFileReferenceDto {
        return fileStoreService.assignAndUpload(file, resourceService.getUniqueFilename(file)).toDto()
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('document-manager')")
    fun deleteFile(@PathVariable id: UUID) {
        fileStoreService.deleteById(id)
    }
}
