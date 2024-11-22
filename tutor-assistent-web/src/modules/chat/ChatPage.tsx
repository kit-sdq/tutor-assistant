import React, { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { isNotPresent, isPresent } from '../../lib/utils/utils.ts'
import { useChatManager } from './hooks/useChatManager.ts'
import { useTranslation } from 'react-i18next'
import { useSelectedChat } from './hooks/useSelectedChat.ts'
import { useAsyncActionTrigger } from './hooks/useAsyncActionTrigger.ts'
import { MainContent, Row, VStack } from '../../lib/components/flex-layout.tsx'
import { Divider } from '@mui/joy'
import { ChatDetails } from './components/details/ChatDetails.tsx'
import { ChatOverview } from './components/overview/ChatOverview.tsx'
import { SubmitTextarea } from '../../common/components/SubmitTextarea.tsx'


export function ChatPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const inputRef = useRef<HTMLTextAreaElement>(null)

    const chatId = useParams().chatId
    const { createChat } = useChatManager()
    const { selectedChat, sendMessage, isLoading } = useSelectedChat(chatId)
    console.log('selectedChat', selectedChat)
    const [isSending, sendMessageAction] = useAsyncActionTrigger(
        handleSend,
        () => isPresent(selectedChat) && selectedChat.id === chatId,
        [selectedChat?.id],
    )


    useEffect(() => {
        inputRef.current?.focus()
    }, [isSending, isLoading, inputRef.current, chatId])

    async function handleSubmit() {
        const input = inputRef.current
        if (isNotPresent(input) || input.value.trim() === '') return

        await handleCreateChat()
        sendMessageAction()
    }

    async function handleCreateChat() {
        if (isNotPresent(chatId)) {
            const chat = await createChat()
            navigate(`/chats/${chat.id}`)
        }
    }

    async function handleSend() {
        const input = inputRef.current
        if (isNotPresent(input) || input.value === '') return

        const message = input.value
        if (message !== '') {
            await sendMessage(message)
            input.value = ''
        }
    }

    return (
        <VStack spacing={1}>
            <MainContent>
                {
                    isPresent(chatId)
                        ? <ChatDetails />
                        : <ChatOverview />
                }
            </MainContent>

            <Divider sx={{ marginTop: '0px !important' }} />
            <Row alignItems='center' padding={1}>
                <MainContent>
                    <SubmitTextarea
                        onCtrlEnter={handleSubmit}
                        maxRows={10}
                        sx={{ marginTop: 0 }}
                        slotProps={{ textarea: { ref: inputRef } }}
                        placeholder={t('Message')}
                        disabled={isSending || isLoading}
                    />
                </MainContent>

            </Row>

        </VStack>
    )
}


