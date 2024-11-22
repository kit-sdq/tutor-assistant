import { useFiles } from './useFiles.ts'
import { ChatMessageContext } from '../chat-model.ts'
import { isNotPresent } from '../../../lib/utils/utils.ts'

export function useOpenContexts() {
    const { loadFile } = useFiles()

    function openContexts(context: ChatMessageContext | string | undefined) {
        if (isNotPresent(context)) return
        const key = typeof context === 'string' ? context : context.originalKey
        if (isNotPresent(key)) return

        if (key.startsWith('http')) {
            window.open(key, '_blank')
        } else {
            loadFile(key)
        }
    }

    return {
        openContexts,
    }
}