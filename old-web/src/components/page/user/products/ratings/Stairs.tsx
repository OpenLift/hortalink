import { useStore } from "@nanostores/react";
import Products from "../../../../../stores/Products";

export default function Stairs(props: { stars: number, star_src: string, staroff_src: string }) {
    const stars_number = props.stars
    const stars = new Array(5).fill(0)
    
    return <>
            {
                stars.map((_, i) => (
                    <div className="star" key={i}>
                        <img
                            src={i > Math.floor(stars_number) ? props.staroff_src : props.star_src}
                            alt="Estrela"
                            width={16}
                            height={16}
                        />
                    </div>
                ))
            }
        </>
    
}