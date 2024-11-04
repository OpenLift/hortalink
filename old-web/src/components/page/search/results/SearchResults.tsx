import SearchResultContainer, { SearchResultContext } from "./SearchResultContainer";
import { useContext } from "react";

import Selector from "./Selector";
import { useStore } from "@nanostores/react";

import Products from "../../../../stores/Products";
import Images from "../../../../stores/Images";
import UnpaginatedProductList from "../../../../layouts/UnpaginatedProductList";

function ProductsList({ arrow_image_src, location_image_src, star_image_src, filter_image_src }) {
  
    return (
        <>
            {
                <UnpaginatedProductList
                    arrow_image_src={arrow_image_src}
                    location_image_src={location_image_src}
                    star_image_src={star_image_src}
                    filter_image_src={filter_image_src}
                    store={"search_result"}
                    isColumn={true}
                    noInitialFetch={true}
                    useCache={false}
                />
            }
        </>
    )
}

export default function SearchResults(props: { arrow_image_src: string, location_image_src: string, star_image_src: string, filter_image_src: string }) {
    return (
        <>
            <SearchResultContainer store="search_result">
                <Selector />
                <ProductsList {...props} />
            </SearchResultContainer>
        </>
    )
}