import "../../../../../style/pages/home/client_home.scss";

import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";

import Geolocation from "../../../../../stores/Geolocation";
import Products from "../../../../../stores/Products";
import call_all from "../../../../../api/call_all";

import Items from "../../../home/client_home/Items";
import get_products_dist from "../../../../../api/get_products_dist";

export default function ProductsSection(props: { star_image_src: string, location_image_src: string, arrow_image_src: string}) {
    const { star_image_src, location_image_src, arrow_image_src } = props

    const [requested, setRequested] = useState(false)

    useEffect(() => {
        call_all(setRequested)
    }, [])

    return (
        <>
            <section className="products_section">
                <Items
                    store="most_requested"
                    star_image_src={star_image_src}
                    location_image_src={location_image_src}
                    arrow_image_src={arrow_image_src}
                    container_id="most_requested"
                />
            </section>
        </>
    )
}