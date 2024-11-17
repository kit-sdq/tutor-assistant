package de.niklaskerkhoff.tutorassistantappservice.modules.calendar

import de.niklaskerkhoff.tutorassistantappservice.modules.calendar.entities.Calendar
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("calendar")
class CalendarController(
    private val calendarService: CalendarService
) {
    @GetMapping
    fun getInfo(@RequestParam currentDate: String, @RequestParam currentTitle: String): List<CalendarFrontendData> =
        calendarService.getCalendar(currentDate, currentTitle)

    @GetMapping("all")
    @PreAuthorize("hasRole('document-manager')")
    fun getAllInfos(): List<Calendar> = calendarService.getAllCalendars()

    @PostMapping
    @PreAuthorize("hasRole('document-manager')")
    fun reloadInfo() = calendarService.loadNewCalendar()
}
