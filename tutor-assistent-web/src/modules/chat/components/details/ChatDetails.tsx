import { HStack, MainContent, VStack } from '../../../../lib/components/flex-layout.tsx'
import { ChatMessageList } from './ChatMessageList.tsx'
import React, { useEffect, useState } from 'react'
import { Scroller } from '../../../../lib/components/Scroller.tsx'
import { Header } from '../../../../common/components/Header.tsx'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@mui/joy'
import { useNavigate } from 'react-router-dom'
import { ArrowBackIosNew } from '@mui/icons-material'
import { isNotPresent } from '../../../../lib/utils/utils.ts'
import { Chat } from '../../chat-model.ts'
import { last } from '../../../../lib/utils/array-utils.ts'
import { ChatAdditionalInfo } from './ChatAdditionalInfo.tsx'


interface Props {
    chat: Chat | undefined
}

export function ChatDetails({ chat }: Props) {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const [selectedMessageId, setSelectedMessageId] = useState<string>()

    useEffect(() => {
        if (isNotPresent(chat)) return
        setSelectedMessageId(last(chat.messages)?.id)
    }, [chat?.messages.length])

    if (isNotPresent(chat)) return <></>

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
                        title={chat.summary?.title ?? t('New Chat')}
                    />

                    <MainContent>
                        <Scroller
                            padding={1}
                            scrollToBottomOnChange={[
                                chat.messages.length,
                                last(chat.messages)?.content?.length ?? 0,
                            ]}
                        >
                            <ChatMessageList
                                messages={chat.messages}
                                onMessageClick={id => setSelectedMessageId(id)}
                                selectedMessageId={selectedMessageId}
                            />
                        </Scroller>
                    </MainContent>
                </VStack>
            </MainContent>
            <ChatAdditionalInfo chat={chat} selectedMessageId={selectedMessageId} />
        </HStack>
    )
}
