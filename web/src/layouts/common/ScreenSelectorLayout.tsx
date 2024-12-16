import type { ScreenSelectorProps } from "@interfaces/ScreenSelectorProps";
import "@styles/common/screen_selector.scss";
import { createContext } from "react";

const ScreenSelectorContext = createContext<{ 
    currentPage: unknown, 
    setCurrentPage: React.Dispatch<React.SetStateAction<unknown>>
}>({
    currentPage: null,
    setCurrentPage: null    
})

export default function ScreenSelectorLayout(props: { children: React.ReactElement<ScreenSelectorProps> | React.ReactElement<ScreenSelectorProps>[], currentPage: unknown, setCurrentPage: React.Dispatch<React.SetStateAction<unknown>>}) {
    return (
        <ScreenSelectorContext.Provider value={{ currentPage: props.currentPage, setCurrentPage: props.setCurrentPage }}>
            <section className="gb_screen_selector">
                {props.children}
            </section>
        </ScreenSelectorContext.Provider>
    )
}

export {
    ScreenSelectorContext
}