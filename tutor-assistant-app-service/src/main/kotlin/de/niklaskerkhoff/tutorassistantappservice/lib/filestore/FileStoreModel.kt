package de.niklaskerkhoff.tutorassistantappservice.lib.filestore

import de.niklaskerkhoff.tutorassistantappservice.lib.entities.AppEntity
import jakarta.persistence.Embeddable
import jakarta.persistence.Embedded
import jakarta.persistence.Entity

@Entity
class FileStoreFileReference(
    @Embedded val assignment: FileStoreAssignment,
    @Embedded val upload: FileStoreUpload,
    val storeUrl: String,
    val displayName: String = upload.name
) : AppEntity()

@Embeddable
data class FileStoreAssignment(
    val fid: String,
    val url: String,
    val publicUrl: String,
    val count: Int,
)

@Embeddable
data class FileStoreUpload(
    val name: String,
    val size: Long,
    val eTag: String,
)

data class FileStoreDelete(
    val size: Long,
)
