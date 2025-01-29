import type { SellerOrder, SellerOrderProduct } from "@interfaces/Orders";

const UNITS = {
    1: "kg",
    2: "g"
}

export default function SellerOrderData(props: { product: SellerOrderProduct, fullOrder: SellerOrder }) {
    let total = 0

    for(const product of props.fullOrder.products) {
        total += product.amount * product.price
    }

    return (
        <main>
            <div id="order_code">
                Código do pedido:<br />
                #{props.product.order_id}
            </div>
            <h2>Dados</h2>
            <p><span className="label_text">Status do pedido:</span> {props.product.status}</p>
            <p><span className="label_text">Retirada:</span> </p>
            <p className="label_text">Cliente:</p>
            <div className="client_card">
                <img
                    src={`${import.meta.env.PUBLIC_FRONTEND_CDN_URL}/avatars/${props.fullOrder.user.id}/${props.fullOrder.user.avatar}.png?size=128`}
                    width={64}
                    height={64}
                    className="client_photo"
                />
                <div className="text">
                    <h2 style={{ marginBottom: "0.5rem" }}>{props.fullOrder.user.name}</h2>
                    <p>Entrar em contato</p>
                </div>
                <a href="/" className="see_profile">Ver perfil</a>
            </div>
            <div className="line" />
            <h2 style={{ marginBottom: "1rem" }}>Produtos</h2>
            <div className="order_products">
                {props.fullOrder && props.fullOrder.products.map((product) => (
                    <div className="order_product" key={product.product_id}>
                        <img 
                            className="product_img"
                            width={75}
                            height={75}
                            src={`${import.meta.env.PUBLIC_FRONTEND_CDN_URL}/products/${product.product_id}/${product.photo.replace("/", "⁄")}.jpg?size=256`}
                        />
                        <div className="text">
                            <h2>{product.product_name}</h2>
                            <p><span className="label_text">Valor:</span> R${product.price} / {UNITS[product.unit] || "unknown"}</p>
                            <p><span className="label_text">Quantidade:</span> {product.amount}</p>
                        </div>
                        <div className="totalValue">
                            <p className="label_text" style={{ fontSize: "0.8em" }}>Valor total:</p>
                            <p style={{ fontSize: "1em", textAlign: "right" }}>R$ {product.price * (product.amount || 1)}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="line" />
            <h2>Resumo</h2>
            <p><span className="label_text">Qt Produtos:</span> {props.fullOrder.products.length}</p>
            <p><span className="label_text">Total:</span> <span className="price">R$ {total}</span></p>
            <button className="update_button">Atualizar Status do pedido</button>
        </main>
    )
}