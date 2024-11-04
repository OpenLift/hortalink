import { imagesContext, itemsContext, ItemsPaginationContext } from "../../layouts/ProductList"
import { useContext } from "react";
import { useStore } from "@nanostores/react";
import Products from "../../stores/Products";
import formatDistance from "../../util/formatDistance.ts";

function ItemDist(props: { id: number }) {
    const dists = useStore(Products.all_products_dist)

    return <>{dists && dists[props.id] ? formatDistance(dists[props.id]): "N/A"}</>
}

export default function Product(props: { item: any, i: number }) {
    const item = props.item
    const { ArrowBack_image, ArrowNext_image, Location_image, Star_image } = useContext(imagesContext)

    const { container_id } = useContext(itemsContext)
    const { slide_pos } = useContext(ItemsPaginationContext)

    if(!item) {
        console.log(item)
        return <></>
    } else {
        return (
            <a href={`/users/${item.seller_id}/products/${item.id}`} className={`product ${props.i == slide_pos || props.i == (slide_pos + 1) ? "" : `hidden`}`} key={`${container_id}-${item.id}`}>
                <div className="head">
                    <h3>{item.product.name}</h3>
                    {
                        item.rating_quantity &&
                        <span>
                            {Star_image}
                            <p>({item.rating_quantity})</p>
                        </span>
                    }
                </div>
                <img
                    src={`${import.meta.env.PUBLIC_FRONTEND_CDN_URL}/products/${item.id}/${item.photo.replace("/", "⁄")}.jpg?size=256`}
                    width={145}
                    height={138}
                    alt={`Foto do produto "${item.product.name}"`}
                />
                <div className="footer">
                    <span>
                        {Location_image}
                        <p><ItemDist id={item.id}/></p>
                    </span>
                    <span className="price">
                        <span className="highlight">R$ {item.price}</span>/
                        <span className="quantity">{item.unit_quantity}{item.unit}</span>
                    </span>
                </div>
            </a>
        )
    }
}