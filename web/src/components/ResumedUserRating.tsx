import type { IndividualRating } from "@interfaces/Product";
import { useEffect } from "react";

export default function ResumedUserRating(props: { rating: IndividualRating }) {
    const productData = props.rating.product

    const totalStairs = 5
    const solidStars = props.rating.rating

    const ratingDate = new Date(props.rating.created_at * 1000).toLocaleDateString("pt-br", { dateStyle: "short" })

    return (
        <div className="user_rating">
            <div className="content resumed_rating">
                <div className="header">
                    <div style={{ minWidth: "200px" }}>
                        <h2>{props.rating.product.name}</h2>
                        <p>{props.rating.user.name}</p>
                    </div>
                    <div>
                        <div className="stairs">
                            {
                                new Array(solidStars).fill(0).map((_, i) => {
                                    return (
                                        <img
                                            src="/assets/star.svg"
                                            width={19}
                                            height={19}
                                            key={`solidstar-${i}-${props.rating.id}`}
                                        />
                                    )
                                })
                            }
                            {
                                new Array(totalStairs - solidStars).fill(0).map((_, i) => {
                                    return (
                                        <img
                                            src="/assets/star_off.svg"
                                            width={19}
                                            height={19}
                                            key={`offstar-${i}-${props.rating.id}`}
                                        />
                                    )
                                })
                            }
                        </div>
                        <p>{ratingDate}</p>
                    </div>
                </div>
                <p className="rating_text">{props.rating.content.length > 42 ? props.rating.content.slice(0, 42) + "..." : props.rating.content}</p>
            </div>
        </div>
    )
}