import type { ScreenSelectorProps } from "@interfaces/ScreenSelectorProps";
import { ScreenSelectorContext } from "@layouts/common/ScreenSelectorLayout";
import { useContext, useEffect } from "react";

export default function ScreenSelector(props: ScreenSelectorProps & { text: string }) {
    const context = useContext(ScreenSelectorContext)

    function handleClick() {
        context.setCurrentPage(props.pageName)
    }

    useEffect(() => {
        document.addEventListener("keydown", (e) => {
            if(!e.key) return;
            const key = e.key.toLowerCase()

            if(key === "enter") {
                const element = document.activeElement as HTMLDivElement

                if(element.classList.contains("result_type_option")) {
                    context.setCurrentPage(element.dataset.type)
                }
            }
        })
    }, [])

    return (
        <p
            onClick={handleClick}
            tabIndex={0}
            data-type={props.pageName}
            className={`result_type_option ${context.currentPage === props.pageName ? 'selected' : ''}`}
        >{props.text}</p>
    )
}