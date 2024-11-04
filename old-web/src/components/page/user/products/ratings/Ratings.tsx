import { useStore } from "@nanostores/react";
import Products from "../../../../../stores/Products";

import Stairs from "./Stairs";
import RatingsInfo from "./RatingsInfo";
import RatingsFilter from "./RatingsFilter";

export default function Ratings(props: { staroff_src: string, star_src: string, filter_src: string, filter_solid_src: string, x_src: string }) {
    const ratings = useStore(Products.current_product_ratings)

    return (
        <>
            <header>
                <h1>Avaliações</h1>
                <RatingsInfo star_src={props.star_src} staroff_src={props.staroff_src} filter_src={props.filter_src} filter_solid_src={props.filter_solid_src} x_src={props.x_src}></RatingsInfo>
            </header>
            <div className="line" />
            <section className="ratings">
                {
                    ratings && ratings?.ratings?.map((rating, i) => (
                        <div className="rating" key={i}>
                            <div className="rating_title">
                                <div>
                                    <h2>{rating.user.name}</h2>
                                    <p>{new Date(Date.now() - rating.created_at).toLocaleDateString("pt-br", { dateStyle: "short" })}</p>
                                </div>                            
                                <div className="stairs">
                                    <div className="content">
                                        <Stairs
                                            stars={rating.rating}
                                            star_src={props.star_src}
                                            staroff_src={props.staroff_src}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="rating_content">
                                <p>{rating.content}</p>
                            </div>
                        </div>
                    ))
                }
            </section>
        </>
    )
}