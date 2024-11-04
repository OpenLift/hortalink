import { useState } from "react";
import type { Notification } from "../../../interfaces/Notification";

const sample_data: Notification[] = [
    {
        id: 1,
        created_at: new Date(),
        read: false,
        title: "O status do seu pedido foi atualizado."
    },
    {
        id: 2,
        created_at: new Date(Date.now() - 125000),
        read: true,
        title: "O status do seu pedido foi atualizado."
    },
    {
        id: 2,
        created_at: new Date( Date.now() - 1525000),
        read: true,
        title: "Vimos que você esqueceu algumas informações no seu cadastro."
    }
]

function formatDate(date: Date) {
    const currentDate = new Date()

    if((`${date.getDay()}-${date.getMonth()}`) === (`${currentDate.getDay()}-${currentDate.getMonth()}`)) {
        return `${date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`
    } else if(((date.getDay())) === (currentDate.getDate() - 1) && (date.getMonth() === currentDate.getMonth())) {
        return `Ontem`
    } else {
        return `${date.getDay()}/${date.getMonth()} ${date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`
    }
}

export default function Notifications(props: { notifications: Notification[] }) {
    const [notifications, setNotifications] = useState<Notification[]>(props.notifications)

    return (
        <section className="notifications_list_container">
            {
                notifications.map((notification, i) => (
                    <div className={`notification ${notification.read ? "" : "notification_marked"}`}>
                        <div className={`ellipse ${notification.read ? "" : "ellipse_marked"}`} />
                        <p>{notification.title}</p>
                        <p>{formatDate(notification.created_at)}</p>
                    </div>
                ))
            }
        </section>
    )
}