import { useTranslation } from 'react-i18next'
import { useTutorAssistantDocuments } from '../hooks/useTutorAssistantDocuments.ts'
import { Row, Spacer, VStack } from '../../../lib/components/flex-layout.tsx'
import { Button } from '@mui/joy'
import { StandardList } from './StandardList.tsx'
import { Scroller } from '../../../lib/components/Scroller.tsx'

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

    return (
        <VStack>
            <Scroller padding={1}>
                <VStack gap={1}>

                    <Row>
                        <Spacer />
                        {canManage && (<Button variant='outlined' onClick={index}>{t('Index')}</Button>)}
                    </Row>

                    <StandardList
                        title={t('Files')}
                        items={files}
                        getLabel={file => file.title}
                        onReload={file => reindexFile(file.id)}
                        onDelete={file => deleteFile(file.id)}
                        canManage={canManage}
                    />
                    <StandardList
                        title={t('Websites')}
                        items={websites}
                        getLabel={website => website.title}
                        onReload={website => reindexWebsite(website.id)}
                        onDelete={website => deleteWebsite(website.id)}
                        canManage={canManage}
                    />
                </VStack>

            </Scroller>
        </VStack>
    )
}
