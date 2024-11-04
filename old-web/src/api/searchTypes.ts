import request_api from "./request_api";

export default async function SearchTypes(query: string, page: number = 1, per_page: number = 10) {
    const searchParams = new URLSearchParams()

    searchParams.append("query", query)
    searchParams.append("page", String(page))
    searchParams.append("per_page", String(per_page))

    const types = await request_api(`/v1/resources/products?${searchParams.toString()}`)

    return types
}