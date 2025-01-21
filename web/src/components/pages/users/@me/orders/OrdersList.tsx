import ScreenSelectorLayout from "@layouts/common/ScreenSelectorLayout";
import ScreenSelector from "@components/common/ScreenSelector";
import { useState } from "react";
import { OrderType } from "./Orders";
import OrdersLayout from "@layouts/OrdersLayout";

export default function OrdersList() {
    const [orderType, setOrderType] = useState<OrderType>(OrderType.Open)

    return (
        <section className="orders_list_container">
            <ScreenSelectorLayout currentPage={orderType} setCurrentPage={setOrderType}>
                <ScreenSelector pageName={OrderType.Open} text="Abertos" />
                <ScreenSelector pageName={OrderType.Closed} text="Fechados" />
            </ScreenSelectorLayout>
            {orderType === OrderType.Open && <OrdersLayout />}
        </section>
    )
}