package de.niklaskerkhoff.tutorassistantappservice.lib.entities

import jakarta.persistence.*
import org.springframework.data.annotation.CreatedBy
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedBy
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.Instant
import java.util.*

@Entity
@EntityListeners(AuditingEntityListener::class)
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
abstract class AppEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    open val id: UUID? = null

//    @Version
//    open val version = 0

    @CreatedDate
    open var createdDate: Instant? = null
        protected set

    @LastModifiedDate
    open var lastModifiedDate: Instant? = null
        protected set

    @CreatedBy
    open var createdBy: String? = null
        protected set

    @LastModifiedBy
    open var lastModifiedBy: String? = null
        protected set
}
