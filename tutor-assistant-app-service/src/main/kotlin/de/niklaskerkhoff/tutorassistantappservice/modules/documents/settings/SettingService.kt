package de.niklaskerkhoff.tutorassistantappservice.modules.documents.settings

import com.fasterxml.jackson.databind.ObjectMapper
import de.niklaskerkhoff.tutorassistantappservice.lib.app_components.AppService
import de.niklaskerkhoff.tutorassistantappservice.lib.exceptions.BadRequestException
import de.niklaskerkhoff.tutorassistantappservice.lib.filestore.FileStoreService
import de.niklaskerkhoff.tutorassistantappservice.modules.documents.applications.ApplicationDocumentLoader
import de.niklaskerkhoff.tutorassistantappservice.modules.documents.applications.entities.Document
import de.niklaskerkhoff.tutorassistantappservice.modules.documents.settings.entities.Setting
import de.niklaskerkhoff.tutorassistantappservice.modules.documents.settings.entities.SettingRepo
import de.niklaskerkhoff.tutorassistantappservice.modules.documents.settings.entities.SettingType
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.util.*

@Service
class SettingService(
    private val settingRepo: SettingRepo,
    private val fileStoreService: FileStoreService,
    private val objectMapper: ObjectMapper
) : AppService(), ApplicationDocumentLoader {

    companion object {
        private val VALUE_STRATEGIES = mapOf<String, (String) -> String>(
            "plain" to { it },
            "underscored" to { it.replace(" ", "_") }
        )
    }

    override fun loadDocuments(): List<Document> {
        val settings = settingRepo.findAll()
        val (tempMainSettings, tempValueSettings) = settings.partition { it.type == SettingType.MAIN }
        if (tempMainSettings.isEmpty()) throw BadRequestException("Main setting does not exist")

        val mainJson = tempMainSettings.first().content
        val values = tempValueSettings.associate { it.name to it.content.trim().split('\n') }
        val fileStoreIdsAndUrls = fileStoreService.listFiles().associate { it.displayName to Pair(it.id, it.storeUrl) }

        return SettingsParser(objectMapper, mainJson, values, fileStoreIdsAndUrls, VALUE_STRATEGIES).parse().also {
            log.info("Parsed ${it.size} documents")
        }
    }

    fun getSettings(): List<Setting> = settingRepo.findAll()

    @Transactional
    fun addSettings(file: MultipartFile): Setting {
        val name = file.originalFilename ?: throw BadRequestException("File name must not be null")
        val fileEnding = name.split(".").last()
        val value = file.inputStream.bufferedReader().use { it.readText() }
        val type = if (fileEnding == "json") SettingType.MAIN else SettingType.VALUES

        settingRepo.deleteAllByName(name).also {
            log.info("Deleted existing settings with name '$name'")
        }

        if (type == SettingType.MAIN) {
            settingRepo.deleteAllByType(type).also {
                log.info("Deleted main setting if existed")
            }
        }

        val setting = Setting(name, value, type)
        return settingRepo.save(setting).also {
            log.info("Saved new setting with name '$name'")
        }
    }

    fun deleteSetting(id: UUID) {
        settingRepo.deleteById(id).also {
            log.info("Deleted setting with id $id")
        }
    }
}
