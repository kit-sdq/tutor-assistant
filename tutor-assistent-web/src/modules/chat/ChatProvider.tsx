import { createContext, useState } from 'react'
import { Chat } from './chat-model.ts'
import { chill } from '../../lib/utils/utils.ts'
import { ChildrenProps, State } from '../../lib/types.ts'


export const ChatContext = createContext<State<Chat>>([undefined, chill])

export function ChatProvider({ children }: ChildrenProps) {
    const state = useState<Chat>()

    return (
        <ChatContext.Provider value={state}>
            {children}
        </ChatContext.Provider>
    )
}
