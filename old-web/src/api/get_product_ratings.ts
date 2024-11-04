import request_api from "./request_api";

export default async function get_product_ratings(seller: number, product: number, options: { page: number, per_page: number }, session_id?: string) {
    const url = new URL("http://localhost:321")

    url.searchParams.append("page", String(options.page))
    url.searchParams.append("per_page", String(options.per_page))

    return await request_api(`/v1/sellers/${seller}/products/${product}/ratings${url.search}`, "include", session_id ? `session_id=${session_id}` : undefined)
}