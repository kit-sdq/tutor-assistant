import { useContext } from 'react'
import { ChatContext } from './ChatProvider.tsx'

export function useChatContext() {
    return useContext(ChatContext)
}
