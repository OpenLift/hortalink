import { useState, useContext } from "react";
import { SearchContext } from "./SearchContainer";
import Products from "../../../stores/Products";
import SearchContainer from "./SearchContainer";
import SearchBar from "./SearchBar";
import Tags from "./Tags";

import UnpaginatedProductList from "../../../layouts/UnpaginatedProductList";
import Images from "../../../stores/Images";

export default function SearchMenu(props: { store: string, arrow_image_src: string, location_image_src: string, star_image_src: string, filter_image_src: string }) {
    const images = Images.get()

    const { arrow_image_src, location_image_src, star_image_src, filter_image_src } = props

    return (
        <>
            <UnpaginatedProductList
                arrow_image_src={arrow_image_src}
                location_image_src={location_image_src}
                star_image_src={star_image_src}
                filter_image_src={filter_image_src}
                store={props.store}
                noInitialFetch={false}
            />
        </>
    )
}