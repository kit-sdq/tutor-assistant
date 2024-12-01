import { HStack, MainContent, VStack } from '../../common/components/containers/flex-layout.tsx'
import { Header } from '../../common/components/containers/Header.tsx'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/joy'
import { ArrowBackIosNew } from '@mui/icons-material'
import React from 'react'
import { DocumentSettingsList } from './components/DocumentSettingsList.tsx'
import { TutorAssistantDocumentsList } from './components/TutorAssistantDocumentsList.tsx'
import { useAuth } from '../../app/auth/useAuth.ts'


/**
 * View and manage documents.
 * This includes uploading settings and perform indexing based on these settings.
 */
export function DocumentsPage() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const { getRoles } = useAuth()
    const canManage = getRoles().includes('document-manager')

    return (
        <VStack>
            <HStack>
                {canManage && (
                    <DocumentSettingsList canManage={canManage} />
                )}
                <MainContent>
                    <VStack>
                        <Header
                            leftNode={
                                <Button
                                    color='primary'
                                    variant='plain'
                                    onClick={() => navigate('/chats')}
                                    startDecorator={<ArrowBackIosNew />}
                                >
                                    {t('Chats')}
                                </Button>
                            }
                            title={t('Documents')}
                        />
                        <MainContent>
                            <TutorAssistantDocumentsList canManage={canManage} />
                        </MainContent>
                    </VStack>
                </MainContent>
            </HStack>

        </VStack>
    )
}