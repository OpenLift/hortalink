import "@styles/layouts/orders.scss";

export default function OrdersLayout() {
    return (
        <section className="orders_container">
            <div className="order">
                <div className="order_part">
                    <div>
                        <h2 className="order_title">Pedido 22</h2>
                        <p className="order_author">Cliente: Maia Fernandes</p>
                    </div>
                    <p className="order_date">20/11 17:05</p>
                </div>
                <div className="order_part" style={{ alignItems: "flex-end" }}>
                    <p className="order_price">Valor: 59,90</p>
                    <div className="order_status status_processing">
                        <p>Processando</p>
                    </div>
                </div>
            </div>
            <div className="order">
                <div className="order_part">
                    <div>
                        <h2 className="order_title">Pedido 22</h2>
                        <p className="order_author">Cliente: Maia Fernandes</p>
                    </div>
                    <p className="order_date">20/11 17:05</p>
                </div>
                <div className="order_part" style={{ alignItems: "flex-end" }}>
                    <p className="order_price">Valor: 59,90</p>
                    <div className="order_status status_processing">
                        <p>Processando</p>
                    </div>
                </div>
            </div>
        </section>
    )
}