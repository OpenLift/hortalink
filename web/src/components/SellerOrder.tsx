import type { SellerOrder, SellerOrderProduct } from "@interfaces/Orders";

const OrderClasses = {
    1: "status_pending",
    2: "status_confirmed",
    3: "status_cancelled",
    4: "status_delivered"
}

const OrderStatusText = {
    1: "Em separação",
    2: "Aguardando retirada",
    3: "Cancelado",
    4: "Entregue"
}

export default function SellerOrder(props: { fullOrder: SellerOrder, orderProduct: SellerOrderProduct }) {
    return (
        <a className="order" href={`/users/@me/orders/${props.orderProduct.order_id}?product_id=${props.orderProduct.product_id}`}>
            <div className="order_part">
                <div>
                    <h2 className="order_title">Pedido #{props.orderProduct.order_id}</h2>
                    <p className="order_author">Cliente: {props.fullOrder.user.name}</p>
                </div>
                <p className="order_date">20/11 17:05</p>
            </div>
            <div className="order_part" style={{ alignItems: "flex-end" }}>
                <p className="order_price">Valor: R$ {props.orderProduct.amount * props.orderProduct.price}</p>
                <div className={`order_status ${OrderClasses[props.orderProduct.status] || "status_processing"}`}>
                    <p>{OrderStatusText[props.orderProduct.status] || "Processando"}</p>
                </div>
            </div>
        </a>
    )
}

export {
    OrderClasses,
    OrderStatusText
}