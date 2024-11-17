package de.niklaskerkhoff.tutorassistantappservice.lib.entities

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.NoRepositoryBean
import java.util.*

@NoRepositoryBean
interface AppEntityRepo<E> : JpaRepository<E, UUID>
