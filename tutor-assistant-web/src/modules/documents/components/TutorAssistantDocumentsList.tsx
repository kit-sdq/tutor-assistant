import { useTranslation } from 'react-i18next'
import { useTutorAssistantDocuments } from '../hooks/useTutorAssistantDocuments.ts'
import { Row, Spacer, VStack } from '../../../lib/components/flex-layout.tsx'
import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, Button, Typography } from '@mui/joy'
import { StandardList } from './StandardList.tsx'
import { Scroller } from '../../../lib/components/Scroller.tsx'
import { useOpenContexts } from '../../chat/hooks/useOpenContexts.ts'
import { useMemo } from 'react'
import { FileDocument, WebsiteDocument } from '../model.ts'

interface Props {
    canManage: boolean
}

export function TutorAssistantDocumentsList({ canManage }: Props) {
    const { t } = useTranslation()
    const {
        index,
        files,
        websites,
        reindexFile,
        reindexWebsite,
        deleteFile,
        deleteWebsite,
    } = useTutorAssistantDocuments()

    const generalKey = t('General')
    const grouped = useMemo(() => {
        const result = {
            [generalKey]: {
                files: [] as FileDocument[],
                websites: [] as WebsiteDocument[],
            },
        }

        files.forEach((file) => {
            const key = file.collection ?? generalKey
            if (!(key in result)) {
                result[key] = { files: [], websites: [] }
            }
            result[key].files.push(file)
        })

        websites.forEach((website) => {
            const key = website.collection ?? generalKey
            if (!(key in result)) {
                result[key] = { files: [], websites: [] }
            }
            result[key].websites.push(website)
        })
        return result
    }, [files, websites])

    const { openContexts } = useOpenContexts()

    return (
        <VStack>
            <Scroller padding={1}>
                <VStack gap={1}>

                    <Row alignItems='center'>
                        <Spacer />
                        {canManage && (<Button variant='outlined' onClick={index}>{t('Index')}</Button>)}
                    </Row>

                    <AccordionGroup sx={{ width: '100%' }}>
                        {
                            Object.keys(grouped).map((key, index) => (
                                <Accordion key={key} defaultExpanded={index === 0}>
                                    <AccordionSummary>
                                        <Typography level='body-sm'>{key}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <StandardList
                                            items={grouped[key].files}
                                            getLabel={file => file.title}
                                            onClick={file => openContexts(file.fileStoreId)}
                                            onReload={file => reindexFile(file.id)}
                                            onDelete={file => deleteFile(file.id)}
                                            canManage={canManage}
                                        />
                                        <StandardList
                                            items={grouped[key].websites}
                                            getLabel={website => website.title}
                                            onClick={website => openContexts(website.url)}
                                            onReload={website => reindexWebsite(website.id)}
                                            onDelete={website => deleteWebsite(website.id)}
                                            canManage={canManage}
                                        />
                                    </AccordionDetails>

                                </Accordion>
                            ))
                        }

                    </AccordionGroup>


                </VStack>

            </Scroller>
        </VStack>
    )
}
