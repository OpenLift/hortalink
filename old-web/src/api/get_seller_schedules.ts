import request_api from "./request_api";

export default async function get_product_schedules(seller: number, product: number, session_id: string) {
    return await request_api(`/v1/sellers/${seller}/schedules`, "include", `session_id=${session_id}`)
}