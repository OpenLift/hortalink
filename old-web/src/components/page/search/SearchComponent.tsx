import SearchMenu from "./SearchMenu";
import SearchResults from "./results/SearchResults";

import SearchContainer, { SearchContext } from "./SearchContainer";
import SearchBar from "./SearchBar";
import Tags from "./Tags";
import { useContext, useEffect, useRef } from "react";
import { ResultType, SearchResultContext } from "./results/SearchResultContainer";

import { useStore } from "@nanostores/react";
import Products from "../../../stores/Products";
import FilterModal from "./filter/FilterModal";

function SearchScreens(props: { store: string, arrow_image_src: string, location_image_src: string, star_image_src: string, filter_image_src: string }) {
    const searched = useStore(Products.search_result)
    console.log(searched)

    return (
        <>
            { searched.length === 0 && <SearchMenu {...props} />}
            { searched.length > 0 && <SearchResults {...props} /> }
        </>
    )
}

function ModalShowingController(props: { spanRef: React.MutableRefObject<HTMLSpanElement> }) {
    const { filter_modal_open } = useContext(SearchContext)

    useEffect(() => {
        props.spanRef.current.hidden = !filter_modal_open
    }, [filter_modal_open])

    return <></>
}

function Modal(props: any) {
    const spanRef = useRef<HTMLSpanElement>()

    return (
        <>
            <span ref={spanRef}>
                <FilterModal {...props} />
            </span>        
            <ModalShowingController spanRef={spanRef} />
        </>
    )
}

export default function SearchComponent(props: { store: string, arrow_image_src: string, location_image_src: string, star_image_src: string, filter_image_src: string }) {
    const { result_type } = useContext(SearchResultContext)

    return (
        <>
            <SearchContainer store={props.store}>
                <SearchBar {...props}/>
                <div className="line" />
                <Tags />

                <SearchScreens {...props} />
                <Modal {...props} />

            </SearchContainer>
        </>
    )
}