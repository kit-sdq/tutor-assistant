import { createContext, Dispatch, SetStateAction, useState } from 'react'
import { Chat, ChatMessageFeedback } from './chat-model.ts'
import { ChildrenProps } from '../../common/types.ts'
import { chill } from '../../common/utils/utils.ts'

type ChatContextType = {
    chats: Chat[]
    setChats: Dispatch<SetStateAction<Chat[]>>
    selectedChat: Chat | undefined
    setSelectedChat: Dispatch<SetStateAction<Chat | undefined>>
    selectedMessageId: string | undefined
    setSelectedMessageId: Dispatch<SetStateAction<string | undefined>>
    selectedMessageFeedback: ChatMessageFeedback | undefined
    setSelectedMessageFeedback: Dispatch<SetStateAction<ChatMessageFeedback | undefined>>
}

export const ChatContext = createContext<ChatContextType>({
    chats: [],
    setChats: chill,
    selectedChat: undefined,
    setSelectedChat: chill,
    selectedMessageId: undefined,
    setSelectedMessageId: chill,
    selectedMessageFeedback: undefined,
    setSelectedMessageFeedback: chill,
})

export function ChatProvider({ children }: ChildrenProps) {
    const [chats, setChats] = useState<Chat[]>([])
    const [selectedChat, setSelectedChat] = useState<Chat>()
    const [selectedMessageId, setSelectedMessageId] = useState<string>()
    const [selectedMessageFeedback, setSelectedMessageFeedback] = useState<ChatMessageFeedback>()

    const value: ChatContextType = {
        chats, setChats,
        selectedChat, setSelectedChat,
        selectedMessageId, setSelectedMessageId,
        selectedMessageFeedback, setSelectedMessageFeedback,
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}
