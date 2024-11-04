import Products from "../../../../stores/Products";
import { useStore } from "@nanostores/react";
import Geolocation from "../../../../stores/Geolocation";
import formatDistance from "../../../../util/formatDistance.ts";

export default function Items(props: { container_id: string, store: string, star_image_src: string, location_image_src: string, arrow_image_src: string, noscroll?: boolean }) {
    const products = useStore(Products.search_result)
    const pos = useStore(Geolocation.position)

    return (
        <>  
            <section className="products_column">
                <div className="products_column_content">
                    {
                        products.length !== 0 && products.map((item, i) => (
                            <div className="product" key={`${props.container_id}-${item.id}`}>
                                <div>
                                    <img
                                        src={`${import.meta.env.PUBLIC_FRONTEND_CDN_URL}/products/${item.id}/${item.photos.replace("/", "⁄")}.jpg?size=256`}
                                        width={108}
                                        height={108}
                                        alt={`Foto do produto "${item.product.name}"`}
                                    />
                                </div>
                                <div>
                                    <h2>{item.product.name}</h2>
                                    <div className="product_infos">
                                        <p>Distância: {item.dist ? formatDistance(item.dist) : "N/A"}</p>
                                        <p>Valor por {item.unit}: {item.price}</p>
                                    </div>
                                    <div className="product_modal_rating">
                                        <img
                                            src={props.star_image_src}
                                            alt="Imagem de uma estrela, ao lado direito está indicando o número de avaliações."
                                            width={14}
                                            height={14}
                                        />
                                        <p>({item.rating_quantity || "N/A "})</p>
                                    </div>
                                    <span className="price">
                                        <span className="highlight">R$ {item.price}</span>/
                                        <span className="quantity">{item.unit_quantity}{item.unit}</span>
                                    </span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </section>
        </>
    )
}