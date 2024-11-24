import { useEffect, useState } from 'react'
import { useAuth } from '../../../app/auth/useAuth.ts'
import { apiBaseUrl } from '../../../app/base.ts'
import { remove } from '../../../lib/utils/array-utils.ts'
import { isNotPresent } from '../../../lib/utils/utils.ts'
import { FileDocument, WebsiteDocument } from '../model.ts'

export function useTutorAssistantDocuments() {
    const [files, setFiles] = useState<FileDocument[]>([])
    const [websites, setWebsites] = useState<WebsiteDocument[]>([])

    const { getAuthHttp } = useAuth()

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
        files,
        websites,
        reindexFile,
        reindexWebsite,
        deleteFile,
        deleteWebsite,
    }
}
