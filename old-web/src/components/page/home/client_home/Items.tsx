import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import Products from "../../../../stores/Products";
import ItemsModal from "./ItemsModal";
import Geolocation, { GPS_state } from "../../../../stores/Geolocation";
import formatDistance from "../../../../util/formatDistance.ts";

import { memo, useMemo, createContext } from "react";
import type { MemoExoticComponent } from "react";
import call_all from "../../../../api/call_all";
import useStoreAsReactState from "../../../../util/useStoreAsReactState";

const itemsContext = createContext([])

function ItemDist(props: { id: number }) {
    const dists = useStore(Products.all_products_dist)
    return <>{dists ? formatDistance(dists[props.id]) : "N/A"}</>
}

function RenderItems(props: { store: string, star_image_src: string, location_image_src: string, arrow_image_src: string, slide_pos: number, noscroll?: boolean, container_id: string }) {
    const [items, set_items, unsubscribe] = useStoreAsReactState(Products[props.store]) as any

    let currentPage = 1

    useEffect(() => {
        const items_element = document.querySelectorAll<HTMLElement>(`#${props.container_id} .product_list .product_container .product`)
        const prev_element = document.querySelector<HTMLElement>(`#${props.container_id} .arr-prev`)
        const next_element = document.querySelector<HTMLElement>(`#${props.container_id} .arr-next`)

        if(props.slide_pos === 0) {
            prev_element.style.display = "none"
        } else {
            prev_element.style.display = "block"
        }

        if(props.slide_pos >= items.length - 1) {
            next_element.style.display = "none"
        } else {
            next_element.style.display = "block"
        }

        if(props.slide_pos >= items.length - 2) {
            currentPage += 1
            call_all(undefined, undefined, currentPage, undefined, true, props.store).then(() => {
                next_element.style.display = "block"
            })
        }

    }, [props.slide_pos])

    return (
        <>
            {
                items && items.map((item, i) => {
                    return (
                        <a href={`/users/${item.seller_id}/products/${item.id}`} className={`product ${i >= props.slide_pos && !props.noscroll ? "" : `${props.noscroll ? "" : "hidden"}`}`} key={`${props.container_id}-${item.id}`}>
                            <div className="head">
                                <h3>{item.product.name}</h3>
                                {
                                    item.rating_quantity &&
                                    <span>
                                        <StarImage star_image_src={props.star_image_src} />
                                        <p>({item.rating_quantity})</p>
                                    </span>
                                }
                            </div>
                            <img 
                                src={`${import.meta.env.PUBLIC_FRONTEND_CDN_URL}/products/${item.id}/${item.photos[0].replace("/", "⁄")}.jpg?size=256`}
                                width={145}
                                height={138}
                                alt={`Foto do produto "${item.product.name}"`}
                            />
                            <div className="footer">
                                <span>
                                    <Location_Img location_image_src={props.location_image_src}/>
                                    <p><ItemDist id={item.id}/></p>
                                </span>
                                <span className="price">
                                    <span className="highlight">R$ {item.price}</span>/
                                    <span className="quantity">{item.unit_quantity}{item.unit}</span>
                                </span>
                            </div>
                        </a>
                    )
                })
            }
        </>
    )
}

const Location_Img = memo(({location_image_src}: any) => {
    return (
        <img
            src={location_image_src}
            alt="Ícone de GPS, ao lado está a sua distância até o vendedor, em quilômetros."
            width={15}
            height={15}
        />
    )
}, (prev, next) => true)

const ArrowBack = memo(({ arrow_image_src }: any) => {
    return (
      <img src={arrow_image_src}
        alt="Seta para direita, clique para passar os elementos do carrossel."
        width={35}
        height={35}
        style={{ transform: "rotate(180deg)" }}
      />
    );
}, (prev, next) => true);
  
const StarImage = memo(({ star_image_src }: any) => {
    return (
      <img
        src={star_image_src}
        alt="Imagem de uma estrela, ao lado direito está indicando o número de avaliações."
        width={12}
        height={12}
      />
    );
}, (prev, next) => true);
  
const ArrowNext = memo(({ arrow_image_src }: any) => {
    return (
      <img src={arrow_image_src}
        alt="Seta para direita, clique para passar os elementos do carrossel."
        width={35}
        height={35}
      />
    );
}, (prev, next) => true);

export default function Items(props: { container_id: string, store: string, star_image_src: string, location_image_src: string, arrow_image_src: string, noscroll?: boolean }) {
    const [slide_pos, set_slide_pos] = useState<number>(0)

    /*useEffect(() => {
        Geolocation.position.listen(new_position => {
            const latitude = new_position[0]
            const longitude = new_position[1]

            // função para obter apenas a distância pela API (ainda não tem)
        })
    }, [])*/

    const arrow_image_src = useMemo(() => {
        return props.arrow_image_src
    }, [])

    return (
        <>
            <section className={`products ${props.noscroll ? "products_noscroll" : ""}`} id={props.container_id}>
                <div className="arrow_container arr-prev" onClick={(() => slide_pos >= 2 ? set_slide_pos(slide_pos - 2) : console.log("?"))}>
                    <ArrowBack arrow_image_src={props.arrow_image_src} />
                </div>
                <div className={`product_list`}>
                    <div className="product_container">
                        <RenderItems {...props} slide_pos={slide_pos} />
                    </div>
                </div>
                <div className="arrow_container arr-next" onClick={(() => set_slide_pos(slide_pos + 2))}>
                    <ArrowNext arrow_image_src={props.arrow_image_src} />
                </div>
            </section>
        </>
    )
}