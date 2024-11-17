import { useEffect, useRef, useState } from 'react'
import { Chat, ChatMessage } from '../chat-model.ts'
import { last, lastIndex } from '../../../lib/utils/array-utils.ts'
import { apiBaseUrl } from '../../../app/base.ts'
import { useAuth } from '../../../app/auth/useAuth.ts'
import { SSE, SSEvent } from 'sse.js'
import { useKeycloak } from '@react-keycloak/web'
import { isNotPresent } from '../../../lib/utils/utils.ts'

export function useChat(chatId: string | undefined) {
    const eventStreamEnd = '=====END====='
    const messageEnd = '=====MESSAGE_END====='


    const [chat, setChat] = useState<Chat>()

    const [isLoading, setIsLoading] = useState(false)
    const sseRef = useRef<SSE>()
    const { getAuthHttp } = useAuth()

    const { keycloak } = useKeycloak()

    useEffect(() => {
        loadChat()
        return () => {
            cleanupStreaming()
        }
    }, [chatId])


    async function loadChat() {
        if (isNotPresent(chatId)) {
            setChat(undefined)
            return
        }
        setIsLoading(true)
        const result = await getAuthHttp().get<Chat>(`${apiBaseUrl}/chats/${chatId}`)
        setChat(result.data)
        setIsLoading(false)
    }

    async function sendMessage(message: string) {

        if (isLoading) return
        if (isNotPresent(chat)) return

        sseRef.current?.close()

        setChat(prevState => {

            if (isNotPresent(prevState)) return

            return {
                ...prevState,
                messages: [
                    ...prevState.messages,
                    { role: 'user', content: message },
                ],
            }
        })

        const url = `${apiBaseUrl}/chats/${chat.id}/messages`

        const sse = new SSE(url, {
            headers: {
                Authorization: `Bearer ${keycloak.token}`,
            },
            method: 'POST',
            payload: message,
        })

        sseRef.current = sse
        setIsLoading(true)


        sse.onmessage = (event: SSEvent) => {
            if (event.data === messageEnd) {
                // message complete. waiting for summary
            } else if (event.data === eventStreamEnd) {
                cleanupStreaming()
                loadChat()
            } else {
                processData(event.data)
            }
        }

        sse.onerror = (event: SSEvent) => {
            console.log('ERROR: ', event)
            sseRef.current?.close()
            setIsLoading(false)
        }
    }

    function cleanupStreaming() {
        sseRef.current?.close()
        setIsLoading(false)
    }

    function processData(data: string) {
        const token = data.substring(1, data.length - 1)

        setChat(prevState => {
            if (isNotPresent(prevState)) return

            const messages = [...prevState.messages]

            const lastMessage = last(messages)!
            if (lastMessage.role === 'user') {
                messages.push({ role: 'ai', content: '' })
            }

            const lastAiMessage = last(messages)!

            const updatedAiMessage: ChatMessage = {
                ...lastAiMessage,
                content: lastAiMessage.content + token,
            }

            messages[lastIndex(messages)] = updatedAiMessage

            return {
                ...prevState,
                messages,
            }
        })
    }

    return {
        chat,
        sendMessage,
        isLoading,
    }
}
