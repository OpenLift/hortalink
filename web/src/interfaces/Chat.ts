import type { PreviewUser } from "./User";

interface ChatPreview {
    id: number,
    user: PreviewUser,
    last_message: string
}

interface ChatMessage {
    is_author: boolean,
    content: string,
    created_at: number,
    viewed: boolean
}

export type {
    ChatPreview,
    ChatMessage
}