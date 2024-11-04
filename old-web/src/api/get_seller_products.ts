import request_api from "./request_api";
import Products from "../stores/Products";

export default async function get_seller_products(seller_id: string, session_id?: string) {
    const request_data = await request_api(`/v1/sellers/${seller_id}/products?page=1&per_page=10`, "include", session_id ? `session_id=${session_id}` : undefined)

    if(!session_id) {
        // only on front
        Products.products.set(request_data)
    }
    
    return request_data
}