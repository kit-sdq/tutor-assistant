package de.niklaskerkhoff.tutorassistantappservice.modules.chat.controller

import de.niklaskerkhoff.tutorassistantappservice.lib.entities.findByIdOrThrow
import de.niklaskerkhoff.tutorassistantappservice.modules.chat.model.messages.MessageFeedback
import de.niklaskerkhoff.tutorassistantappservice.modules.chat.model.messages.MessageRepo
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("chats/messages")
class MessageController(
    private val messageRepo: MessageRepo
) {
    @GetMapping("{id}")
    fun getMessageFeedback(@PathVariable id: UUID) = messageRepo.findByIdOrThrow(id).feedback


    data class RatingPatch(val rating: Int)

    @PatchMapping("{id}/feedback-rating")
    fun setMessageRating(@PathVariable id: UUID, @RequestBody patch: RatingPatch): MessageFeedback {
        val message = messageRepo.findByIdOrThrow(id)
        message.feedback = message.feedback.copy(rating = patch.rating)
        messageRepo.save(message)
        return message.feedback
    }

    data class ContentPatch(val content: String)

    @PatchMapping("{id}/feedback-content")
    fun setMessageRating(@PathVariable id: UUID, @RequestBody patch: ContentPatch): MessageFeedback {
        val message = messageRepo.findByIdOrThrow(id)
        message.feedback = message.feedback.copy(content = patch.content.trim())
        messageRepo.save(message)
        return message.feedback
    }
}
