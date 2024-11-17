package de.niklaskerkhoff.tutorassistantappservice.modules.documents.resources

import de.niklaskerkhoff.tutorassistantappservice.lib.exceptions.BadRequestException
import de.niklaskerkhoff.tutorassistantappservice.lib.filestore.FileStoreFileReferenceDefaultRepo
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile

@Service
class ResourceService(
    private val fileReferenceDefaultRepo: FileStoreFileReferenceDefaultRepo
) {
    companion object {
        private const val UNIQUE_START_N = 2
    }

    fun getUniqueFilename(file: MultipartFile): String {
        val filename = file.originalFilename ?: throw BadRequestException("Filename must not be null")
        return getUniqueFilename(filename)
    }

    private fun getUniqueFilename(filename: String, n: Int? = null): String {
        val fileReferences = fileReferenceDefaultRepo.findAllByDisplayName(filename)
        if (fileReferences.size > 1) throw UnknownError("Filenames must be unique")
        if (fileReferences.isNotEmpty()) {
            return if (n == null) getUniqueFilename(filename, UNIQUE_START_N) else getUniqueFilename(filename, n + 1)
        }

        return if (n == null) filename else addNumberToFilename(filename, n)
    }

    private fun addNumberToFilename(filename: String, number: Int): String {
        val dotIndex = filename.lastIndexOf('.')
        return if (dotIndex != -1) {
            val name = filename.substring(0, dotIndex)
            val extension = filename.substring(dotIndex)
            "$name.$number$extension"
        } else {
            "$filename.$number"
        }
    }
}
