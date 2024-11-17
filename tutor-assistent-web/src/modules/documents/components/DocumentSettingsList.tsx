import { MainContent, Row, Spacer, VStack } from '../../../lib/components/flex-layout.tsx'
import { useDocumentSettings } from '../hooks/useDocumentSettings.tsx'
import { StandardList } from './StandardList.tsx'
import { useTranslation } from 'react-i18next'
import { Add } from '@mui/icons-material'
import { Scroller } from '../../../lib/components/Scroller.tsx'
import { FileButton } from './FileButton.tsx'
import { Bar } from '../../../common/components/Bar.tsx'
import { Header } from '../../../common/components/Header.tsx'
import React from 'react'

interface Props {
    canManage: boolean
}

export function DocumentSettingsList({ canManage }: Props) {

    const {
        mainSettings,
        valueSettings,
        resources,
        addSetting,
        addResource,
        deleteSetting,
        deleteResource,
    } = useDocumentSettings()

    const { t } = useTranslation()
    return (
        <Bar>
            <Header title={t('Uploads')} />
            <MainContent>
                <Scroller padding={1}>
                    <VStack gap={1}>

                        <Row gap={1}>
                            <Spacer />
                            <FileButton
                                addFile={addSetting}
                                startDecorator={<Add />}
                                variant='outlined'
                            >
                                {t('Setting')}
                            </FileButton>
                            <FileButton
                                addFile={addResource}
                                startDecorator={<Add />}
                                variant='outlined'
                            >
                                {t('Resource')}
                            </FileButton>
                        </Row>
                        <StandardList
                            title={t('Main Setting')}
                            items={mainSettings}
                            getLabel={setting => setting.name}
                            onDelete={setting => deleteSetting(setting.id)}
                            canManage={canManage}
                        />
                        <StandardList
                            title={t('Value Settings')}
                            items={valueSettings}
                            getLabel={setting => setting.name}
                            onDelete={setting => deleteSetting(setting.id)}
                            canManage={canManage}
                        />
                        <StandardList
                            title={t('Resources')}
                            items={resources}
                            getLabel={resource => resource.displayName}
                            onDelete={resource => deleteResource(resource.id)}
                            canManage={canManage}
                        />
                    </VStack>

                </Scroller>
            </MainContent>
        </Bar>
    )
}




