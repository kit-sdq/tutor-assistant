import { useAuth } from '../../../app/auth/useAuth.ts'
import { apiBaseUrl } from '../../../app/base.ts'

export function useFiles() {
    const { getAuthHttp } = useAuth()

    async function loadFile(id: string) {
        const response = await getAuthHttp().get(`${apiBaseUrl}/documents/resources/${id}`, {
            responseType: 'blob',
        })

        const blobUrl = URL.createObjectURL(response.data)
        window.open(blobUrl, '_blank')

        setTimeout(() => URL.revokeObjectURL(blobUrl), 30_000)
    }

    return {
        loadFile,
    }
}