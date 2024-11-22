import { Chat, ChatMessageContext, ChatSummary } from '../../chat-model.ts'
import React, { useMemo, useState } from 'react'
import { Bar } from '../../../../common/components/Bar.tsx'
import { isNotPresent, isPresent } from '../../../../lib/utils/utils.ts'
import { Header } from '../../../../common/components/Header.tsx'
import { useTranslation } from 'react-i18next'
import { Scroller } from '../../../../lib/components/Scroller.tsx'
import { MainContent, Spacer, VStack } from '../../../../lib/components/flex-layout.tsx'
import { Box, Button, Card, CardActions, CardContent, ToggleButtonGroup, Typography } from '@mui/joy'
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
    const { t } = useTranslation()
    const [additionalInfo, setAdditionalInfo] = useState<'summary' | 'contexts' | null>('contexts')
    const contexts = useMemo(() => {
        if (isNotPresent(selectedMessageId) && empty(chat.messages)) return undefined
        return chat.messages.find(message => message.id === selectedMessageId)?.contexts
    }, [selectedMessageId])

    function handleTabChange(_: unknown, newValue: 'summary' | 'contexts' | null) {
        if (isPresent(newValue)) {
            setAdditionalInfo(newValue)
        }
    }

    if (isNotPresent(additionalInfo)) return <></>

    return <Bar className='right'>
        <Header
            title={
                <ToggleButtonGroup
                    value={additionalInfo}
                    onChange={handleTabChange}
                    size='sm'
                >
                    <Button value='contexts'>{t('Sources')} ({contexts?.length ?? 0})</Button>
                    <Button value='summary'>{t('Summary')}</Button>
                </ToggleButtonGroup>
            }
        />
        {
            additionalInfo === 'summary' && <Summary
                summary={chat.summary}
            />
        }

        {
            additionalInfo === 'contexts' && <Contexts
                contexts={contexts}
            />
        }
    </Bar>
}

interface SummaryProps {
    summary: ChatSummary | undefined
}

function Summary({ summary }: SummaryProps) {

    return (
        <>
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
}

function Contexts({ contexts }: ContextsProps) {
    const { t } = useTranslation()

    const { openContexts } = useOpenContexts()

    if (isNotPresent(contexts)) contexts = []

    function getTitleAndPage(context: ChatMessageContext) {
        const pageOutput = isPresent(context.page) ? `, ${t('Page')} ${context.page + 1}` : ''
        return isPresent(context.title) ? `${context.title}${pageOutput}` : ''
    }

    if (contexts.length === 0) return (
        <VStack justifyContent='center' alignItems='center'>
            <Typography>{t('Select a message')}</Typography>
        </VStack>
    )

    return (
        <>
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

