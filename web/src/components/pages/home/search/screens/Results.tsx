import Products from "@layouts/Products";
import Product from "@components/Product";
import { useEffect, useState } from "react";
import type { Product as ProductT } from "@interfaces/Product";

import APIWrapper, { RequestAPIFrom } from "@HortalinkAPIWrapper";
import { filter } from "../Search";
import { products_result } from "../Search"

import ProductsColumn from "@layouts/ProductsColumn";
import ProductColumn from "@components/ProductColumn";
import { useStore } from "@nanostores/react";

enum ResultType {
    Products = 1,
    Users
}

function ProductResults(props: { products: ProductT[] }) {
    const products = props.products

    if(!products.length) {
        return (
            <p className="noresult">Nenhum resultado.</p>
        )
    }

    return (
        <ProductsColumn>
            {
                products?.map((product) => (
                    <ProductColumn product={product} key={`result-product-${product.id}`} />
                ))
            }
        </ProductsColumn>
    )
}

export default function Results() {
    const api = new APIWrapper(RequestAPIFrom.Client)
    const [products, setProducts] = useState<ProductT[]>([])
    const [resultType, setResultType] = useState<ResultType>(ResultType.Products)

    useEffect(() => {
        filter.listen(async v => {
            const newData = await api.getProducts(v)
            setProducts(newData)
        })
    }, [])

    useEffect(() => {
        document.addEventListener("keydown", (e) => {
            if(!e.key) return;
            const key = e.key.toLowerCase()

            if(key === "enter") {
                const element = document.activeElement as HTMLDivElement

                if(element.classList.contains("result_type_option")) {
                    setResultType(Number(element.dataset.type) as ResultType)
                }
            }
        })
    }, [])

    return (
        <>
            <div className="search_products_container">
                <div className="result_type_selector">
                    <p
                        tabIndex={0}
                        data-type={ResultType.Products}
                        className={`result_type_option ${resultType === ResultType.Products ? "selected" : ""}`}
                        onClick={() => {
                            setResultType(ResultType.Products)
                        }}
                    >
                        Produtos
                    </p>
                    <p
                        tabIndex={0}
                        data-type={ResultType.Users}
                        className={`result_type_option ${resultType === ResultType.Users ? "selected" : ""}`}
                        onClick={() => {
                            setResultType(ResultType.Users)
                        }}
                    >
                        Usuários
                    </p>
                </div>
                {
                    resultType === ResultType.Products && <ProductResults products={products} />
                }
                {
                    resultType === ResultType.Users && <p>TODO</p>
                }
            </div>
        </>
    )
}