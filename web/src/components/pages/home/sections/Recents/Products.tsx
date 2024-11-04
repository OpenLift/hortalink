import type { Product as ProductT } from "@interfaces/Product";
import Products from "@layouts/Products";
import { useEffect, useState } from "react";

import Product from "@components/Product";
import APIWrapper, { RequestAPIFrom } from "@HortalinkAPIWrapper";

import PaginatedProducts from "@components/PaginatedProducts";

export default function RecentProducts() {
    const api = new APIWrapper(RequestAPIFrom.Client)
    const [products, setProducts] = useState<ProductT[]>([])
    const [page, setPage] = useState<number>(1)

    useEffect(() => {
        async function run() {
            const data = await api.getRecentProducts(page)

            setProducts(data)
        }
        
        run()
    }, [])

    return (
        <PaginatedProducts
            products={products}
            setter={setProducts}
            FetchMore={api.getRecentProducts}
            slideSize={3}
        />
    )
}