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
import { useOpenContexts } from '../../hooks/useOpenContexts.ts'
import { Multiline } from '../../../../lib/components/Multiline.tsx'
import { roundTo } from '../../../../lib/utils/math-utils.ts'

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

    const { openContexts } = useOpenContexts()

    if (isNotPresent(contexts)) contexts = []

    function getTitleAndPage(context: ChatMessageContext) {
        const pageOutput = isPresent(context.page) ? `, ${t('Page')} ${context.page + 1}` : ''
        return isPresent(context.title) ? `${context.title}${pageOutput}` : ''
    }

    return (
        <>
            <Header
                title={`${t('Sources')} (${contexts?.length ?? 0})`}
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
                            contexts.map((context, index) => (
                                <Card key={index}>
                                    <CardContent sx={{ maxHeight: '300px', overflow: 'auto' }}>

                                        <Typography level='body-sm'>
                                            {getTitleAndPage(context)}
                                        </Typography>
                                        <Typography level='body-sm'>
                                            {t('Relevance')}: {roundTo(context.score ?? -1, 2)}
                                        </Typography>

                                        <Multiline text={context.content ?? ''} />

                                    </CardContent>
                                    {isPresent(context.originalKey) && (
                                        <CardActions>
                                            <Spacer />
                                            <Button variant='outlined' onClick={() => openContexts(context)}>
                                                {t('Open')}
                                            </Button>
                                        </CardActions>
                                    )}
                                </Card>
                            ))
                        }
                    </VStack>

                </Scroller>
            </MainContent>

        </>
    )
}

