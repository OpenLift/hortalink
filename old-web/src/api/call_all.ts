import Geolocation from "../stores/Geolocation";
import Products from "../stores/Products";

import request_api from "./request_api";

import React from "react";

export default async function call_all(setRequested?: React.Dispatch<React.SetStateAction<boolean>>, product_type?: number, page: number = 1, per_page: number = 10, pushItems: boolean = false, target_store?: string) {
    const position = Geolocation.position.value

    const url = new URL("http://localhost/api/v1")

    url.searchParams.append("page", `${page}`)
    url.searchParams.append("per_page", `${per_page}`)

    if(position) {
        url.searchParams.append("latitude", `${position[0]}`)
        url.searchParams.append("longitude", `${position[1]}`)
    }

    if(product_type) {
        url.searchParams.append("product_id", `${product_type}`)
        const products = await request_api(`/v1/products${url.search}`)

        Products.search_result.set(products)
    } else {
        const products = await request_api(`/v1/users/@me/home${url.search}`)

        const recent = products.recents
        const more_orders = products.more_orders
        const recommendations = products.recommendations
    
        if(pushItems) {
            if(!target_store) {
                throw new Error("Should specify target store when using pushItems")
            }

            const products_recent = Products.recent.get()
            const more_orders_products = Products.most_requested.get()

            switch(target_store) {
                case "recent":
                    Products.recent.set([ ...recent, ...products_recent ])
                    break;
                case "most_requested":
                    Products.most_requested.set([...more_orders, ...more_orders_products])
                break;
            }

        } else {
            Products.recent.set(recent)
            Products.most_requested.set(more_orders)
        }
    }
    
    if(setRequested) {
        setRequested(true)
    }
}