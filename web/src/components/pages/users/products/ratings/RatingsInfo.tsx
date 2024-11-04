import { useStore } from "@nanostores/react";

import Stairs from "./Stairs";
import type { FullRating } from "@interfaces/Product";

export default function RatingsInfo(props: { ratings: FullRating }) {
    const ratings = props.ratings

    const avg = 4
    
    return (
        <div className="infos">
                <Stairs
                    stars={avg}
                    star_src={"/assets/star.svg"}
                    staroff_src={"/assets/star.svg"}
                />
            <p>({ratings?.ratings.length || 0}) avaliações</p>
        </div>
    )
}