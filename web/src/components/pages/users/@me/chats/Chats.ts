import type { ChatPreview } from "@interfaces/Chat";
import { atom } from "nanostores";
import { createRef, useState } from "react";

const SearchBarInputRef = createRef<HTMLInputElement>()
const ChatPreviews = atom<ChatPreview[]>([
    {
        id: 1,
        last_message: "Testeando mensagem grande muito grande",
        user: {
            id: 6,
            name: "Iago lobo",
            followers: 0,
            orders_received: 0,
            avatar: "0emMjJSUjS8"
        }
    }
])

export {
    SearchBarInputRef,
    ChatPreviews
}