export interface Chat {
    id: string
    summary?: ChatSummary
    messages: ChatMessage[]
}

export interface ChatMessage {
    id?: string
    role: 'user' | 'ai'
    content: string
    contexts?: ChatMessageContext[]
}

export interface ChatSummary {
    title: string,
    subtitle: string,
    content: string
}

export interface ChatMessageContext {
    title?: string
    originalKey?: string
    heading?: string
    page?: number
    content?: string
    score?: number
}

export interface ChatMessageFeedback {
    rating: number
    content: string
}
