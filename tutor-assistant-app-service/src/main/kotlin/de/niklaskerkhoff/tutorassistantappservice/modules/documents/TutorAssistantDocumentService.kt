package de.niklaskerkhoff.tutorassistantappservice.modules.documents

import de.niklaskerkhoff.tutorassistantappservice.lib.app_components.AppService
import de.niklaskerkhoff.tutorassistantappservice.lib.webclient.EmptyResponseBodyException
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.ParameterizedTypeReference
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient

@Service
class TutorAssistantDocumentService(
    private val webClient: WebClient
) : AppService() {
    @Value("\${app.tutor-assistant.base-url}")
    private lateinit var baseUrl: String

    fun addDocument(
        title: String,
        originalKey: String,
        loaderType: String,
        loaderParams: Map<String, Any>
    ): List<String> {
        val requestBody = mapOf(
            "title" to title,
            "originalKey" to originalKey,
            "loaderType" to loaderType,
            "loaderParams" to loaderParams,
        )

        return webClient.post()
            .uri("$baseUrl/documents/add")
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(object : ParameterizedTypeReference<List<String>>() {})
            .block() ?: throw EmptyResponseBodyException()
    }

    fun deleteDocument(tutorAssistantIds: List<String>): Boolean {
        return webClient.post()
            .uri("$baseUrl/documents/delete")
            .bodyValue(tutorAssistantIds)
            .retrieve()
            .bodyToMono(Boolean::class.java)
            .block() ?: throw EmptyResponseBodyException()
    }
}
