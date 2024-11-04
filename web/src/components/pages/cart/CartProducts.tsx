import APIWrapper, { RequestAPIFrom } from "@HortalinkAPIWrapper";
import type { Cart } from "@interfaces/Product";
import React from "react";
import { useEffect, useState } from "react";
import CartProduct from "./CartProduct";

export default function CartProducts() {
    const api = new APIWrapper(RequestAPIFrom.Client)
    const [carts, setCarts] = useState<Cart[]>([])

    useEffect(() => {
        async function init() {
            const data = await api.getCart()
            setCarts(data)
        }

        init()
    }, [])

    return (
        <>
            {
                carts.map((cart, i) => {
                    // <div class="line" style="max-width: 401px;" />
                    return (
                        <React.Fragment key={`cart-frag-${cart.user.id}`}>
                            { i > 0 && <div className="line" style={{ maxWidth: "340px" }} key={`cart-line-${cart.user.id}`} />}
                            <CartProduct cart={cart} />
                        </React.Fragment>
                    )
                })
            }
        </>
    )
}