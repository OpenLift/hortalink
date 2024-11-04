import { useEffect, useState } from "react";

const WS_URL = `ws://localhost:5555/ws`

export default function NotificationsWatcher(props: { session_id: string }) {
    useEffect(() => {
        const connection = new WebSocket(WS_URL)

        connection.addEventListener("open", () => {
            const payload = {
                opcode: 10,
                d: {
                    session_id: props.session_id
                }
            }

            connection.send(JSON.stringify(payload))
        })

        connection.addEventListener("message", (data) => {
            console.log(data)
        })
    }, [])

    return <></>
}