import { HStack, MainContent, VStack } from '../../../../lib/components/flex-layout.tsx'
import { ChatMessageList } from './ChatMessageList.tsx'
import React, { useEffect } from 'react'
import { Scroller } from '../../../../lib/components/Scroller.tsx'
import { Header } from '../../../../common/components/Header.tsx'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@mui/joy'
import { useNavigate } from 'react-router-dom'
import { ArrowBackIosNew } from '@mui/icons-material'
import { isNotPresent } from '../../../../lib/utils/utils.ts'
import { last } from '../../../../lib/utils/array-utils.ts'
import { ChatAdditionalInfo } from './ChatAdditionalInfo.tsx'
import { useChatContext } from '../../useChatContext.ts'


interface Props {
}

export function ChatDetails() {
    const { t } = useTranslation()
    const navigate = useNavigate()


    const { selectedChat, selectedMessageId, setSelectedMessageId } = useChatContext()

    useEffect(() => {
        console.log('hier', selectedChat)
        if (isNotPresent(selectedChat)) return
        setSelectedMessageId(last(selectedChat.messages)?.id)
    }, [selectedChat?.messages.length])

    if (isNotPresent(selectedChat)) return <></>

    return (
        <HStack>
            <MainContent>
                <VStack>
                    <Header
                        leftNode={
                            <IconButton color='primary' onClick={() => navigate('/chats')}>
                                <ArrowBackIosNew />
                            </IconButton>
                        }
                        title={selectedChat.summary?.title ?? t('New Chat')}
                    />

                    <MainContent>
                        <Scroller
                            padding={1}
                            scrollToBottomOnChange={[
                                selectedChat,
                                last(selectedChat.messages)?.content?.length ?? 0
                            ]}
                        >
                            <ChatMessageList
                                messages={selectedChat.messages}
                                onMessageClick={id => setSelectedMessageId(id)}
                                selectedMessageId={selectedMessageId}
                            />
                        </Scroller>
                    </MainContent>
                </VStack>
            </MainContent>
            <ChatAdditionalInfo chat={selectedChat} selectedMessageId={selectedMessageId} />
        </HStack>
    )
}