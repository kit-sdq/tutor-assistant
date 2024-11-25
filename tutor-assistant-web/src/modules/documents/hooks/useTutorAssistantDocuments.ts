import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../../app/auth/useAuth.ts'
import { apiBaseUrl } from '../../../app/base.ts'
import { remove } from '../../../common/utils/array-utils.ts'
import { isNotPresent } from '../../../common/utils/utils.ts'
import { FileDocument, WebsiteDocument } from '../model.ts'
import { useTranslation } from 'react-i18next'


/**
 * Manages file and website documents.
 *
 * @property index function to run the indexing process.
 * @property groupedDocuments file and website documents grouped by their collection.
 *                              Each collection contains its file and website documents.
 * @property websites website documents.
 * @property reindexFile function to reindex a file.
 * @property reindexWebsite function to reindex a website.
 * @property deleteFile function to delete a file.
 * @property deleteWebsite function to delete a website.
 */
export function useTutorAssistantDocuments() {
    const { t } = useTranslation()
    const { getAuthHttp } = useAuth()

    const [files, setFiles] = useState<FileDocument[]>([])
    const [websites, setWebsites] = useState<WebsiteDocument[]>([])

    const generalKey = t('General')

    const groupedDocuments = useMemo(() => {
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


    useEffect(() => {
        loadFiles()
        loadWebsites()
    }, [])

    async function index() {
        await getAuthHttp().post(`${apiBaseUrl}/documents/applications/index`)
        loadFiles()
        loadWebsites()
    }


    async function loadFiles() {
        const response = await getAuthHttp().get<FileDocument[]>(`${apiBaseUrl}/documents/applications/files`)
        setFiles(response.data)
    }

    async function loadWebsites() {
        const response = await getAuthHttp().get<WebsiteDocument[]>(`${apiBaseUrl}/documents/applications/websites`)
        setWebsites(response.data)
    }

    async function reindexFile(id: string | undefined) {
        if (isNotPresent(id)) return
        await getAuthHttp().post(`${apiBaseUrl}/documents/applications/files/${id}/reindex`)
    }

    async function reindexWebsite(id: string | undefined) {
        if (isNotPresent(id)) return
        await getAuthHttp().post(`${apiBaseUrl}/documents/applications/websites/${id}/reindex`)
    }

    async function deleteFile(id: string | undefined) {
        if (isNotPresent(id)) return
        await getAuthHttp().delete(`${apiBaseUrl}/documents/applications/files/${id}`)
        setFiles(prevState => remove(id, prevState))
    }

    async function deleteWebsite(id: string | undefined) {
        if (isNotPresent(id)) return
        await getAuthHttp().delete(`${apiBaseUrl}/documents/applications/websites/${id}`)
        setWebsites(prevState => remove(id, prevState))
    }

    return {
        index,
        groupedDocuments,
        reindexFile,
        reindexWebsite,
        deleteFile,
        deleteWebsite,
    }
}
