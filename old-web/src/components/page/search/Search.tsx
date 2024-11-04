import { useStore } from "@nanostores/react"
import { PageType } from "../../../stores/SearchPagination"

import SearchPagination from "../../../stores/SearchPagination"
import SearchMenu from "./SearchMenu"

export default function SearchMain(props: { store: string, arrow_image_src: string, location_image_src: string, star_image_src: string, filter_image_src: string }) {
    const type = useStore(SearchPagination.pageType)


    switch(type) {
        case PageType.SearchHome:
            return (
                <SearchMenu {...props} />
            )
    }
}