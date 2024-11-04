import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react"
import Items from "./Items";
import Products from "../../../../stores/Products";
import Geolocation from "../../../../stores/Geolocation";
import ProductList from "../../../../layouts/ProductList";

import get_products_dist from "../../../../api/get_products_dist";

import call_all from "../../../../api/call_all";

export default function ProductsSection(props: { star_image_src: string, location_image_src: string, arrow_image_src: string}) {
    const { star_image_src, location_image_src, arrow_image_src } = props

    const search_result = useStore(Products.search_result)
    const [requested, setRequested] = useState(false)
    const [firstLoad, setFirstLoad] = useState(false)

    return (
        <>
           {
                !search_result?.length &&
                <>
                    <section className="products_section">
                        <h2>Recentes</h2>
                        {
                            <ProductList
                                star_image_src={star_image_src}
                                location_image_src={location_image_src}
                                arrow_image_src={arrow_image_src}
                                store="recent"
                            />
                        }
                    </section>
                    <section className="products_section">
                        <h2>Mais pedidos</h2>
                        {
                            <ProductList
                                star_image_src={star_image_src}
                                location_image_src={location_image_src}
                                arrow_image_src={arrow_image_src}
                                store="most_requested"
                            />
                        }
                    </section>
                </>
           }
           {
                /*search_result &&
                <>
                    <section className="products_section">
                        <Items
                            star_image_src={star_image_src}
                            location_image_src={location_image_src}
                            arrow_image_src={arrow_image_src}
                            container_id="searched"
                            store="search_result"
                            noscroll={true}
                        />
                    </section>
                </>*/
            }
        </>
    )
}