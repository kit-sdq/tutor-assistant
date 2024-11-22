import { Button, Textarea, TextareaProps, Tooltip } from '@mui/joy'
import React, { ReactNode } from 'react'
import { Row, Spacer } from '../../lib/components/flex-layout.tsx'
import { useTranslation } from 'react-i18next'

interface Props {
    onCtrlEnter: () => void
    additionEndDecorator?: ReactNode
}

export function SubmitTextarea({ onCtrlEnter, additionEndDecorator, ...props }: TextareaProps & Props) {
    const { t } = useTranslation()

    function handleInput(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault()
            onCtrlEnter()
        }
    }

    return (
        <Textarea
            {...props}
            onKeyDown={handleInput}
            endDecorator={
                <Row alignItems='center'>
                    {additionEndDecorator}
                    <Spacer />
                    <Tooltip title={t('Ctrl + Enter')} variant='solid'>
                        <Button onClick={onCtrlEnter}>{t('Send')}</Button>
                    </Tooltip>
                </Row>

            }
        />
    )
}