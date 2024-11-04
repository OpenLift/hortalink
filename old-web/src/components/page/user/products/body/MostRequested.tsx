import "../../../../../style/pages/home/client_home.scss";

import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";

import Geolocation from "../../../../../stores/Geolocation";
import Products from "../../../../../stores/Products";
import call_all from "../../../../../api/call_all";

import Items from "../../../home/client_home/Items";
import ProductList from "../../../../../layouts/ProductList";

export default function ProductsSection(props: { star_image_src: string, location_image_src: string, arrow_image_src: string}) {
    const { star_image_src, location_image_src, arrow_image_src } = props

    const [requested, setRequested] = useState(false)

    useEffect(() => {
        call_all(setRequested)
    }, [])

    return (
        <>
            <section className="products_section">
                <ProductList
                    {...props}
                    store="most_requested"
                />
            </section>
        </>
    )
}