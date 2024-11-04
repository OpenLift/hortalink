import "../../../../style/pages/search/filter.scss";

import { useStore } from "@nanostores/react";
import Products from "../../../../stores/Products";
import { useContext } from "react";
import { SearchContext } from "../SearchContainer";

function Button(props: { filter_image_src: string, star_image_src: string }) {
    const data = useStore(Products.search_result)
    const { set_filter_modal_open } = useContext(SearchContext)

    if(data.length > 0) {
        return (
            <div className="filter_box" onClick={() => {
                set_filter_modal_open(true)
            }}>
                <img
                    src={props.filter_image_src}
                    width={20}
                    height={20}
                    alt="ícone de Filtro"
                />
            </div>
        )
    } else {
        return <></>
    }
}

export default function FilterButton(props: { filter_image_src: string, star_image_src: string }) {
    return (
        <>
            <Button {...props} />
        </>
    )
}