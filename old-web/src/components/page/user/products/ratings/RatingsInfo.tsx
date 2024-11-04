import { useStore } from "@nanostores/react";
import Products from "../../../../../stores/Products";

import Stairs from "./Stairs";
import RatingsFilter from "./RatingsFilter";

export default function RatingsInfo(props: { star_src: string, staroff_src: string, filter_src: string, filter_solid_src: string, x_src: string }) {
    const ratings = useStore(Products.current_product_ratings)

    const avg = 4
    
    return (
        <div className="infos">
                <Stairs
                    stars={avg}
                    star_src={props.star_src}
                    staroff_src={props.staroff_src}
                />
            <p>({ratings?.ratings.length || 0}) avaliações</p>
            <RatingsFilter filter_src={props.filter_src} filter_solid_src={props.filter_solid_src} x_src={props.x_src} star_src={props.star_src} />
        </div>
    )
}