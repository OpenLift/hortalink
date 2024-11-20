import type { Product as ProductT } from "@interfaces/Product";
import { useEffect, useState } from "react";

import APIWrapper, { RequestAPIFrom } from "@HortalinkAPIWrapper";

import PaginatedProducts from "@components/PaginatedProducts";

export default function RecentProducts() {
    const api = new APIWrapper(RequestAPIFrom.Client)
    const [products, setProducts] = useState<ProductT[]>([])
    const [page, setPage] = useState<number>(1)

    async function fetchMore(page: number) {
        return api.getMoreOrderProducts(page)
    }

    useEffect(() => {
        async function run() {
            const data = await api.getMoreOrderProducts(page)

            setProducts(data)
        }
        
        run()
    }, [])

    return (
        <PaginatedProducts
            products={products}
            setter={setProducts}
            FetchMore={api.getMoreOrderProducts}
            slideSize={3}
        />
    )
}