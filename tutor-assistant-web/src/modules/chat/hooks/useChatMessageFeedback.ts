import { useAuth } from '../../../app/auth/useAuth.ts'
import { apiBaseUrl } from '../../../app/base.ts'
import { ChatMessageFeedback } from '../chat-model.ts'
import { isNotPresent } from '../../../lib/utils/utils.ts'
import { useChatContext } from '../useChatContext.ts'

export function useChatMessageFeedback() {
    const { getAuthHttp } = useAuth()

    const { selectedMessageFeedback, setSelectedMessageFeedback } = useChatContext()

    async function loadFeedback(messageId: string) {
        setSelectedMessageFeedback(undefined)
        const response = await getAuthHttp().get<ChatMessageFeedback>(`${apiBaseUrl}/chats/messages/${messageId}`)
        setSelectedMessageFeedback(response.data)
    }

    async function updateFeedbackRating(messageId: string | undefined, rating: number) {
        if (isNotPresent(messageId)) return
        const response = await getAuthHttp()
            .patch<ChatMessageFeedback>(`${apiBaseUrl}/chats/messages/${messageId}/feedback-rating`, { rating })
        setRating(response.data.rating)
    }

    async function updateFeedbackContent(messageId: string, content: string) {
        if (isNotPresent(messageId)) return
        console.log(content)
        const response = await getAuthHttp()
            .patch<ChatMessageFeedback>(`${apiBaseUrl}/chats/messages/${messageId}/feedback-content`, { content })
        setContent(response.data.content)
    }

    function setRating(rating: number) {
        setSelectedMessageFeedback(prevState => isNotPresent(prevState) ? undefined : ({ ...prevState, rating }))
    }

    function setContent(content: string) {
        setSelectedMessageFeedback(prevState => isNotPresent(prevState) ? undefined : ({ ...prevState, content }))
    }


    return {
        selectedMessageFeedback,
        setContent,
        loadFeedback,
        updateFeedbackRating,
        updateFeedbackContent,
    }
}