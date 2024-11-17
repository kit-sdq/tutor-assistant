package de.niklaskerkhoff.tutorassistantappservice.modules.documents.settings

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import de.niklaskerkhoff.tutorassistantappservice.modules.documents.applications.entities.Document
import de.niklaskerkhoff.tutorassistantappservice.modules.documents.applications.entities.FileDocument
import de.niklaskerkhoff.tutorassistantappservice.modules.documents.applications.entities.WebsiteDocument
import java.util.*

class SettingsParser(
    private val objectMapper: ObjectMapper,
    private val mainJson: String,
    private val allValues: Map<String, List<String>>,
    private val fileStoreIdsAndUrls: Map<String, Pair<UUID?, String>>,
    private val valueStrategies: Map<String, (String) -> String>
) {
    companion object {
        private const val WEBSITE_TYPE = "Website"
        private const val FILE_TYPE = "File"
        private val VALUE_REGEX = "\\$\\{(\\w+)}".toRegex()
    }

    fun parse(): List<Document> {
        val json = objectMapper.readTree(mainJson)

        return parseRoot(json)
    }

    private fun parseRoot(json: JsonNode): List<Document> {
        json.requireArray()

        return json.elements().asSequence().map { parseCollectionOrDocument(it) }.flatten().toList()
    }

    private fun parseCollectionOrDocument(json: JsonNode): List<Document> {
        json.requireObject()

        return when {
            json.has("title") -> listOf(parseDocument(json, null, null))
            json.has("collection") -> parseCollection(json)
            else -> throw SettingsParserException("Failed parsing collection or document")
        }
    }

    private fun parseCollection(json: JsonNode): List<Document> {
        json.requireObjectKeys("collection")

        val collection = json["collection"].stringOrThrow()

        return when {
            json.has("elements") -> parseElements(json["elements"], collection)
            json.has("elementsBuilder") -> parseElementsBuilder(json["elementsBuilder"], collection, getValues(json))
            else -> throw SettingsParserException("Failed parsing collection")
        }
    }

    private fun parseElements(json: JsonNode, collection: String?): List<Document> {
        json.requireArray()

        return json.elements().asSequence().map { parseDocument(it, collection, null) }.toList()
    }

    private fun parseElementsBuilder(
        json: JsonNode,
        collection: String?,
        values: List<String>
    ): List<Document> {
        json.requireObject()

        return values.map { parseDocument(json, collection, it) }
    }

    private fun parseDocument(json: JsonNode, collection: String?, value: String?): Document {
        json.requireObjectKeys("type")

        val type = json["type"].stringOrThrow()

        return when (type) {
            WEBSITE_TYPE -> parseWebsite(json, collection, value)
            FILE_TYPE -> parseFile(json, collection, value)
            else -> throw SettingsParserException("Failed parsing document")
        }
    }

    private fun parseFile(json: JsonNode, collection: String?, value: String?): Document {
        json.requireObjectKeys("title", "loaderType", "filename")

        val (fileStoreId, fileStoreUrl) = json.getUrlFromFilename(value)

        return FileDocument(
            json["title"].stringWithValueOrThrow(value),
            json["loaderType"].stringWithValueOrThrow(value),
            collection,
            fileStoreId,
            fileStoreUrl
        )
    }

    private fun parseWebsite(json: JsonNode, collection: String?, value: String?): Document {
        json.requireObjectKeys("title", "loaderType", "loaderParams")

        return WebsiteDocument(
            json["title"].stringWithValueOrThrow(value),
            json["loaderType"].stringWithValueOrThrow(value),
            collection,
            parseWebsiteLoaderParams(json["loaderParams"], value)
        )
    }

    private fun parseWebsiteLoaderParams(json: JsonNode, value: String?): WebsiteDocument.LoaderParams {
        json.requireObjectKeys("url", "htmlSelector", "htmlSelectionIndex")

        return WebsiteDocument.LoaderParams(
            json["url"].stringWithValueOrThrow(value),
            json["htmlSelector"].stringWithValueOrThrow(value),
            json["htmlSelectionIndex"].intOrThrow()
        )
    }

    private fun JsonNode.requireObject() {
        if (!isObject) throw SettingsParserException("Not an object")
    }

    private fun JsonNode.requireArray() {
        if (!isArray) throw SettingsParserException("Not an array")
    }

    private fun JsonNode.requireObjectKeys(vararg keys: String) {
        keys.forEach { if (!has(it)) throw SettingsParserException("Key $it not found") }
    }

    private fun JsonNode.stringOrThrow(): String {
        if (!isTextual) throw SettingsParserException("Not a string")
        return asText()
    }

    private fun JsonNode.intOrThrow(): Int {
        if (!isInt) throw SettingsParserException("Not an int")
        return asInt()
    }

    private fun getValues(json: JsonNode): List<String> {
        json.requireObjectKeys("values")

        val key = json["values"].stringOrThrow()

        return allValues[key] ?: throw SettingsParserException("Values for key $key not found")
    }

    private fun JsonNode.getUrlFromFilename(value: String?): Pair<UUID, String> {
        val filename = this["filename"].stringWithValueOrThrow(value)
        val idAndUrl = fileStoreIdsAndUrls[filename] ?: throw SettingsParserException("File $filename does not exist")
        val id = idAndUrl.first ?: throw SettingsParserException("File store id must not be null")
        return Pair(id, idAndUrl.second)
    }

    private fun JsonNode.stringWithValueOrThrow(value: String?): String {
        val string = stringOrThrow()
        if (value == null) return string

        return VALUE_REGEX.replace(string) { matchResult ->
            val strategyName = matchResult.groups[1]?.value
                ?: throw SettingsParserException("Unknown error reading strategy name")
            val strategy = valueStrategies[strategyName]
                ?: throw SettingsParserException("Value strategy $strategyName does not exist")

            strategy(value)
        }
    }
}

