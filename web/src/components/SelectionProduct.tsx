import type { Product } from "@interfaces/Product";

export default function SelectionProduct(props: { product: Product }) {
    const { product } = props

    return (
        <div className="selection_product">
            <h2>{product.product.name}</h2>
            {
                product.photo &&
                <img 
                    src={`${import.meta.env.PUBLIC_FRONTEND_CDN_URL}/products/${product.id}/${product.photo.replace("/", "⁄")}.jpg?size=256`}
                    width={175}
                    height={170}
                    alt={`Foto do produto "${product.product.name}"`}
                />
            }
            <div className="bottom">
                <a href={`/users/@me/products/edit?product_id=${product.id}`}>Editar</a>
                <p>R$ {product.price} <span style={{ fontSize: "0.8em", verticalAlign: "top" }}>/ {product.unit_quantity}{product.unit}</span></p>
            </div>
        </div>
    )
}