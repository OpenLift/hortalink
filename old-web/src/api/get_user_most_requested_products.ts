import request_api from "./request_api";
import Products from "../stores/Products";

export default async function get_user_most_requested_products(page: number = 1, per_page: number = 10, session_id?: string) {
    const params = new URLSearchParams()
    params.append("page", String(page))
    params.append("per_page", String(per_page))

    const product_type = Products.product_type.value

    if(product_type) {
        params.append("product_type", String(product_type))
    }

    const data = await request_api(`/v1/users/@me/home/more_orders?${params.toString()}`, "include", session_id ? `session_id=${session_id}` : undefined)

    Products.most_requested.set(data)

    return data
}