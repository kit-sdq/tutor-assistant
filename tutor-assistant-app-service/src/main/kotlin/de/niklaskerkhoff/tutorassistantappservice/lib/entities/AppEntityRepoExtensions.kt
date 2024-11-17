package de.niklaskerkhoff.tutorassistantappservice.lib.entities

import org.springframework.data.repository.findByIdOrNull
import java.util.*

fun <T> AppEntityRepo<T>.findByIdOrThrow(id: UUID) = findByIdOrNull(id) ?: throw IllegalArgumentException(id.toString())
