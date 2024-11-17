package de.niklaskerkhoff.tutorassistantappservice.modules.helper

import de.niklaskerkhoff.tutorassistantappservice.modules.calendar.entities.CalendarRepo
import org.apache.commons.text.similarity.LevenshteinDistance
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("helper")
@PreAuthorize("hasRole('document-manager')")
class HelperController(
    val calendarRepo: CalendarRepo
) {

    @GetMapping("info-leven")
    fun getLeven() {
        /*val calendars = calendarRepo.findAll().sortedBy { it.createdDate }.subList(20, 30)
        val permutations = calendars.map { calendar1 -> calendars.map { calendar2 -> Pair(calendar1, calendar2) } }

        val sum = permutations.sumOf { row ->
            row.sumOf { normalizedLevenshtein(it.first.entries.toString(), it.second.entries.toString()) }
        }

        println("---------------------------------------------------")

        println(sum / 100.0)

        println("---------------------------------------------------")
        permutations.forEach { row ->
            println(
                row.joinToString(" ") {
                    String.format(
                        "%.5f",
                        normalizedLevenshtein(it.first.entries.toString(), it.second.entries.toString())
                    )
                }
            )
        }
        println("---------------------------------------------------")*/

    }


    private fun normalizedLevenshtein(str1: String, str2: String): Double {
        val levenshteinDistance = LevenshteinDistance().apply(str1, str2)
        val maxLength = maxOf(str1.length, str2.length)

        return if (maxLength == 0) {
            0.0
        } else {
            levenshteinDistance.toDouble() / maxLength
        }
    }
}
