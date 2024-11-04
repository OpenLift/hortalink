import { imagesContext, itemsContext } from "../../layouts/UnpaginatedProductList";
import { useContext } from "react";

export default function UnpaginatedColumnProduct(props: { item: any }) {
    const item = props.item
    const { Location_image, Star_image } = useContext(imagesContext)

    const { container_id } = useContext(itemsContext)
    return (
        <div className="column_product" key={`${container_id}-${item.id}-column-unpaginated`}>
            <div>
                <img
                    src={`${import.meta.env.PUBLIC_FRONTEND_CDN_URL}/products/${item.id}/${item.photo.replace("/", "⁄")}.jpg?size=256`}
                    width={108}
                    height={108}
                    alt={`Foto do produto "${item.product.name}"`}
                />
            </div>
            <div>
                <h2>{item.product.name}</h2>
                <div className="product_infos">
                    <p>Distância: {"N/A"}</p>
                    <p>Valor por {item.unit}: {item.price}</p>
                </div>
                <div className="product_modal_rating">
                    { Star_image }
                    <p>({item.rating_quantity || "N/A "})</p>
                </div>
                <span className="price">
                    <span className="highlight">R$ {item.price}</span>/
                    <span className="quantity">{item.unit_quantity}{item.unit}</span>
                </span>
            </div>
        </div>
    )
}