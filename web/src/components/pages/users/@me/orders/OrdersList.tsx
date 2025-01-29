import ScreenSelectorLayout from "@layouts/common/ScreenSelectorLayout";
import ScreenSelector from "@components/common/ScreenSelector";
import { useEffect, useState } from "react";
import { OrderType } from "./Orders";
import OrdersLayout from "@layouts/OrdersLayout";

import APIWrapper, { RequestAPIFrom } from "@HortalinkAPIWrapper";
import type { SellerOrderProduct, SellerOrder as SellerOrderType } from "@interfaces/Orders";
import SellerOrder from "@components/SellerOrder";

export default function OrdersList() {
    const [orderType, setOrderType] = useState<OrderType>(OrderType.Open)
    const [orders, setOrders] = useState<SellerOrderType[]>(() => [])

    const api = new APIWrapper(RequestAPIFrom.Client)

    useEffect(() => {
        async function wrap() {
            const newOrders = await api.getOrdersFromClient()
            setOrders(newOrders)
        }

        wrap()
    }, [])

    return (
        <section className="orders_list_container">
            <ScreenSelectorLayout currentPage={orderType} setCurrentPage={setOrderType}>
                <ScreenSelector pageName={OrderType.Open} text="Abertos" />
                <ScreenSelector pageName={OrderType.Closed} text="Fechados" />
            </ScreenSelectorLayout>
            {orderType === OrderType.Open && 
                <OrdersLayout>
                    {
                        orders.map((order) => {
                            return (
                                <>
                                    {
                                        order.products.map((product) => (
                                            <SellerOrder fullOrder={order} orderProduct={product} key={`product-${order.user.id}-${product.product_id}`} />
                                        ))
                                    }
                                </>
                            )
                        })
                    }
                </OrdersLayout>
            }
        </section>
    )
}