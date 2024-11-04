import type { Filter } from "../interfaces/ProductsFilter";
import request_api from "./request_api";
import Products from "../stores/Products";

export default async function get_products(target_store: string = "products") {
    const filter = Products.products_filter.get()
    const params = new URLSearchParams()

    const keys = Object.keys(filter)

    for(const key of keys) {
        params.append(key, String(filter[key]))
    }

    const data = await request_api(`/v1/products?${params.toString()}`, "include")
    Products[target_store].set(data)

    return data
}