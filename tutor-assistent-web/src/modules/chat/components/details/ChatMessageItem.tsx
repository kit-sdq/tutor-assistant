import { Button, styled, Textarea, Typography } from '@mui/joy'
import { ChatMessage } from '../../chat-model.ts'
import rehypeHighlight from 'rehype-highlight'
import React, { useEffect, useState } from 'react'
import { isNotPresent, isPresent } from '../../../../lib/utils/utils.ts'
import classNames from 'classnames'
import remarkGfm from 'remark-gfm'
import { StyledMarkdown } from '../../../../common/components/StyledMarkdown.tsx'
import { Row, Spacer } from '../../../../lib/components/flex-layout.tsx'
import { StarRater } from '../../../../lib/components/StarRater.tsx'
import { useChatMessageFeedback } from '../../hooks/useChatMessageFeedback.ts'
import { useTranslation } from 'react-i18next'


interface Props {
    message: ChatMessage
    onMessageClick?: (messageId: string) => void
    selectedMessageId?: string
}


export function ChatMessageItem({ message, onMessageClick, selectedMessageId }: Props) {
    const { t } = useTranslation()

    const { feedback, setContent, loadFeedback, updateFeedbackRating, updateFeedbackContent } = useChatMessageFeedback()
    const [showThankYou, setShowThankYou] = useState(false)

    useEffect(() => {
        setShowThankYou(false)
        if (isPresent(selectedMessageId)) {
            loadFeedback(selectedMessageId)
        }
    }, [selectedMessageId])

    async function handleSendFeedback() {
        if (isNotPresent(selectedMessageId)) return

        await updateFeedbackContent(selectedMessageId, feedback?.content ?? '')
        setShowThankYou(true)
    }

    function handleMessageClick(message: ChatMessage) {
        if (isPresent(onMessageClick) && isPresent(message.id) && message.role === 'ai') {
            onMessageClick(message.id)
        }
    }

    function isSelected(messageId: string | undefined) {
        return messageId === selectedMessageId
    }

    function getClassNames(message: ChatMessage) {
        return classNames(message.role, { selected: isSelected(message.id) })
    }

    return (
        <Wrapper className={message.role}>
            <Content className={getClassNames(message)} onClick={() => handleMessageClick(message)}>
                {
                    message.role === 'ai'
                        ? (
                            <>
                                <StyledMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                                    {message.content}
                                </StyledMarkdown>
                                {isSelected(message.id) && (
                                    <Textarea
                                        value={feedback?.content ?? ''}
                                        placeholder={t('Feedback')}
                                        onChange={e => {
                                            setContent(e.target.value)
                                            setShowThankYou(false)
                                        }}
                                        startDecorator={
                                            <StarRater
                                                max={5}
                                                rating={feedback?.rating ?? 0}
                                                onSelect={rating => updateFeedbackRating(selectedMessageId, rating)}
                                            />
                                        }
                                        endDecorator={
                                            <Row>
                                                {showThankYou && (
                                                    <Typography level='title-lg' color='primary'>
                                                        {t('Thank You for your feedback!')}
                                                    </Typography>
                                                )}
                                                <Spacer />
                                                <Button onClick={() => handleSendFeedback()}>
                                                    {t('Send')}
                                                </Button>
                                            </Row>
                                        }
                                        maxRows={3}
                                    />
                                )}
                            </>
                        )
                        : message.content
                }
            </Content>
        </Wrapper>
    )
}

const Wrapper = styled('div')`
    display: flex;
    width: 100%;

    &.user {
        justify-content: end;
    }
`

const Content = styled('div')`
    width: 80%;
    padding: 8px;

    border-radius: 8px;


    &.user {
        background: ${props => props.theme.palette.background.level2};
        border-top-right-radius: 0;
    }

    &.ai {
        background: ${props => props.theme.palette.background.level1};
        border-top-left-radius: 0;
    }

    &.ai.selected {
        background: ${props => props.theme.palette.background.level3};
    }
`