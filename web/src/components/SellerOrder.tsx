import type { SellerOrder, SellerOrderProduct } from "@interfaces/Orders";

export default function SellerOrder(props: { fullOrder: SellerOrder, orderProduct: SellerOrderProduct }) {
    return (
        <a className="order" href={`/users/@me/orders/${props.orderProduct.order_id}?product_id=${props.orderProduct.product_id}`}>
            <div className="order_part">
                <div>
                    <h2 className="order_title">Pedido #{props.orderProduct.order_id}</h2>
                    <p className="order_author">Cliente: {props.fullOrder.user.id}</p>
                </div>
                <p className="order_date">20/11 17:05</p>
            </div>
            <div className="order_part" style={{ alignItems: "flex-end" }}>
                <p className="order_price">Valor: R$ {props.orderProduct.amount * props.orderProduct.price}</p>
                <div className="order_status status_processing">
                    <p>Processando</p>
                </div>
            </div>
        </a>
    )
}