import { useState, useEffect } from "react";
import Geolocation from "../../../stores/Geolocation";
import { useStore } from "@nanostores/react";

import type { Cart, CartProductWithAmount } from "../../../interfaces/Cart";
import formatDistance from "../../../util/formatDistance.ts";

function DateInput() {
    return (
        <div className="">

        </div>
    )
}

export default function CartData(props: { cartData: CartProductWithAmount }) {
    const item = props.cartData
    const pos = useStore(Geolocation.position)
    const pos_state = useStore(Geolocation.state)

    console.log(item)

    return (
        <>
            <div className="products">
                <div className="product_data">
                    <input type="checkbox" className="checkbox" />
                    <div className="product">
                        <div>
                            <img
                                src={`${import.meta.env.PUBLIC_FRONTEND_CDN_URL}/products/${item.product_id}/${item.photo ? item.photo.replace("/", "⁄") : undefined}.jpg?size=256`}
                                width={108}
                                height={108}
                                alt={`Foto do produto "${item.product_name}"`}
                            />
                        </div>
                        <div>
                            <h2>{item.product_name}</h2>
                            <div className="product_infos">
                                <p>Distância: {item.dist && pos ? `${formatDistance(item.dist)}` : ""}</p>
                                <p>Valor: R$ {item.price}/{item.unit}</p>
                            </div>
                            <p className="price_label">Valor total</p>
                            <p className="price">R$ {item.price}</p>
                        </div>
                    </div>
                    <div className="order_specs">
                        <DateInput />
                        <div className="amount">
                            <button className="button">
                                -
                            </button>
                            <span>1</span>
                            <button className="button">
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}