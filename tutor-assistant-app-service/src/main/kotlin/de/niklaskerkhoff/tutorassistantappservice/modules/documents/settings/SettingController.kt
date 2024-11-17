package de.niklaskerkhoff.tutorassistantappservice.modules.documents.settings

import de.niklaskerkhoff.tutorassistantappservice.modules.documents.settings.entities.SettingDto
import de.niklaskerkhoff.tutorassistantappservice.modules.documents.settings.entities.toDto
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.util.*

@RestController
@RequestMapping("documents/settings")
class SettingController(
    private val settingService: SettingService
) {

    @GetMapping
    fun getSettings(): List<SettingDto> = settingService.getSettings().map { it.toDto() }

    @PostMapping
    fun addSetting(@RequestPart("file") file: MultipartFile): SettingDto = settingService.addSettings(file).toDto()

    @DeleteMapping("{id}")
    fun deleteSetting(@PathVariable id: UUID): Unit = settingService.deleteSetting(id)
}
