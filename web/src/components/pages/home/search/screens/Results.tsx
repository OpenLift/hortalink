import Products from "@layouts/Products";
import Product from "@components/Product";
import { useEffect, useState } from "react";
import type { Product as ProductT } from "@interfaces/Product";

import APIWrapper, { RequestAPIFrom } from "@HortalinkAPIWrapper";
import { filter, query } from "../Search";
import type { UserResults } from "../Search";
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

function SellerResults(props: { users: UserResults[] }) {

    if(!props.users.length) {
        return (
            <p className="noresult">Nenhum resultado.</p>
        )
    }

    return (
        <div className="users_results">
            {
                props.users.map(user => (
                    <a className="user_result" href={`/sellers/${user.id}`} key={`users-result-${user.id}`}>
                        <div className="user_img">
                            <img
                                src={`${import.meta.env.PUBLIC_FRONTEND_CDN_URL}/avatars/${user.id}/${user.avatar}.png?size=128`}
                                width={78}
                                height={78}
                                alt="Sua foto de perfil"
                            />
                        </div>
                        <div className="user_data">
                            <h2>{user.name}</h2>
                            <div className="user_rating">
                                <img
                                    src="/assets/star.svg"
                                    width={17}
                                    height={17}
                                />
                                <p>4,5</p>
                            </div>
                        </div>
                    </a>
                ))
            }
        </div>
    )
}

export default function Results() {
    const api = new APIWrapper(RequestAPIFrom.Client)
    const [products, setProducts] = useState<ProductT[]>(() => []) // avoid reassign on re-render
    const [users, setUsers] = useState<UserResults[]>(() => [])
    const [resultType, setResultType] = useState<ResultType>(ResultType.Products)

    useEffect(() => {
        filter.listen(async v => {
            if(v.product_id !== -1) {
                const newData = await api.getProducts(v)
                setProducts(newData)
            }
        })

        query.listen(async q => {
            const newData = await api.searchUsers(q, 1, 10)
            setUsers(newData)
            setResultType(ResultType.Users)
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
                    resultType === ResultType.Users && <SellerResults users={users} />
                }
            </div>
        </>
    )
}