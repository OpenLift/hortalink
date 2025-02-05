import React, { useEffect, useState } from 'react';

import { useStore } from "@nanostores/react";
import { ChatPreviews } from "./Chats";
import type { ChatPreview } from "@interfaces/Chat"
import APIWrapper, { RequestAPIFrom } from '@HortalinkAPIWrapper';
 

function ChatsContainer(props: { chats: ChatPreview[] }) {
    const [chats, setChats] = useState(props.chats)
    const API = new APIWrapper(RequestAPIFrom.Client)

    useEffect(() => {
        async function run() {
            const chats = await API.getChats(undefined)
            setChats(chats)
        }

        run()
    }, [])

    return (
        <section className="chats_container">
            {
                chats.map((chat, i) => (
                    <DisplayChatPreview preview={chat} key={i} />
                ))
            }
        </section>
    )
}

function DisplayChatPreview(props: { preview: ChatPreview }) {
    return (
        <a className="chat_preview" href={`/users/@me/chats/${props.preview.id}`}>
            <img 
                className="user_image"
                src={`${import.meta.env.PUBLIC_FRONTEND_CDN_URL}/avatars/${props.preview.user.id}/${props.preview.user.avatar}.png?size=128`}
                alt="Ícone de lupa. Não é necessário clicar, apenas digite que a pesquisa é feita automaticamente."
                width="52"
                height="52"
            />
            <div className="side">
                <div className="preview_upside">
                    <h2>{props.preview.user.name}</h2>
                    <p>19:59</p>
                </div>
                <div className="preview_downside">
                    <p>{props.preview.last_message?.length >= 30 ? props.preview.last_message.slice(0, 30) + "..." : props.preview.last_message}</p>
                </div>
            </div>
        </a>
    )
}

export default ChatsContainer