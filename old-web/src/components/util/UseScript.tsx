import { useEffect } from "react";

export default function UseScript(props: { src: string, id: string }) {
    useEffect(() => {
        const script_container = document.querySelector(`#script-${props.id}`)

        const script_tag = document.createElement("script")
        script_tag.src = props.src

        script_container.appendChild(script_tag)
    })

    return (
        <span id={`script-${props.id}`} />
    )
}