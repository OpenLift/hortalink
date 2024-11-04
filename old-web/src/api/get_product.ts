import request_api from "./request_api";

export default async function get_product(seller: number, product: number, session_id?: string) {
    return await request_api(`/v1/sellers/${seller}/products/${product}`, "include", session_id ? `session_id=${session_id}` : undefined)
}