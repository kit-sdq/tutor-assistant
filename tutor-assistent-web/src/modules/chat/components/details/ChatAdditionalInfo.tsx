import { Chat, ChatMessageContext, ChatSummary } from '../../chat-model.ts'
import React, { useMemo, useState } from 'react'
import { Bar } from '../../../../common/components/Bar.tsx'
import { isNotPresent, isPresent } from '../../../../lib/utils/utils.ts'
import { Header } from '../../../../common/components/Header.tsx'
import { useTranslation } from 'react-i18next'
import { Scroller } from '../../../../lib/components/Scroller.tsx'
import { MainContent, Spacer, VStack } from '../../../../lib/components/flex-layout.tsx'
import { Box, Button, Card, CardActions, CardContent, IconButton, Typography } from '@mui/joy'
import { GradingOutlined, SummarizeOutlined } from '@mui/icons-material'
import { empty } from '../../../../lib/utils/array-utils.ts'
import { StyledMarkdown } from '../../../../common/components/StyledMarkdown.tsx'
import { useFiles } from '../../hooks/useFiles.ts'

interface Props {
    chat: Chat
    selectedMessageId?: string
}

export function ChatAdditionalInfo({ chat, selectedMessageId }: Props) {
    const [additionalInfo, setAdditionalInfo] = useState<'summary' | 'contexts' | undefined>('summary')
    const contexts = useMemo(() => {
        if (isNotPresent(selectedMessageId) && empty(chat.messages)) return undefined
        return chat.messages.find(message => message.id === selectedMessageId)?.contexts
    }, [selectedMessageId])

    if (isNotPresent(additionalInfo)) return <></>

    return (
        <Bar className='right'>
            {
                additionalInfo === 'summary' && (
                    <Summary
                        summary={chat.summary}
                        onContextsClicked={() => setAdditionalInfo('contexts')}
                    />
                )
            }

            {
                additionalInfo === 'contexts' && (
                    <Contexts
                        contexts={contexts}
                        onSummaryClicked={() => setAdditionalInfo('summary')}
                    />
                )
            }
        </Bar>
    )
}

interface SummaryProps {
    summary: ChatSummary | undefined
    onContextsClicked: () => void
}

function Summary({ summary, onContextsClicked }: SummaryProps) {
    const { t } = useTranslation()

    return (
        <>
            <Header
                title={t('Summary')}
                rightNode={
                    <IconButton color='primary' onClick={onContextsClicked}>
                        <GradingOutlined />
                    </IconButton>
                }
            />
            <MainContent>
                <Scroller padding={1}>
                    {
                        isPresent(summary) && (
                            <Box sx={{ overflow: 'hidden' }}>
                                <StyledMarkdown>{`## ${summary.title}`}</StyledMarkdown>
                                <StyledMarkdown>{`### ${summary.subtitle}`}</StyledMarkdown>
                                <StyledMarkdown>{summary.content}</StyledMarkdown>
                            </Box>
                        )
                    }
                </Scroller>
            </MainContent>
        </>
    )
}


interface ContextsProps {
    contexts: ChatMessageContext[] | undefined
    onSummaryClicked: () => void
}

function Contexts({ contexts, onSummaryClicked }: ContextsProps) {
    const { t } = useTranslation()

    const { loadFile } = useFiles()

    function handleOpen(context: ChatMessageContext) {
        if (isNotPresent(context.originalKey)) return

        if (context.originalKey.startsWith('http')) {
            window.open(context.originalKey, '_blank')
        } else {
            loadFile(context.originalKey)
        }
    }

    return (
        <>
            <Header
                title={t('Contexts')}
                rightNode={
                    <IconButton color='primary' onClick={onSummaryClicked}>
                        <SummarizeOutlined />
                    </IconButton>
                }
            />
            <MainContent>
                <Scroller padding={1}>
                    <VStack gap={1}>
                        {
                            isPresent(contexts) && (
                                contexts.map((context, index) => (
                                    <Card key={index}>
                                        <CardContent sx={{ maxHeight: '300px', overflow: 'auto' }}>
                                            {context.content.split('\n').map((content, index) => (
                                                <Typography key={index}>{content}</Typography>
                                            ))}
                                        </CardContent>
                                        {isPresent(context.originalKey) && (
                                            <CardActions>
                                                <Spacer />
                                                <Button variant='outlined' onClick={() => handleOpen(context)}>
                                                    {t('Open')}
                                                </Button>
                                            </CardActions>
                                        )}
                                    </Card>
                                ))
                            )
                        }
                    </VStack>

                </Scroller>
            </MainContent>

        </>
    )
}

