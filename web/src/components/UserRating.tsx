import type { IndividualRating } from "@interfaces/Product";

export default function UserRating(props: { rating: IndividualRating }) {
    const productData = props.rating.product

    const totalStairs = 5
    const solidStars = props.rating.rating

    const ratingDate = new Date(props.rating.created_at).toLocaleDateString("pt-br", { dateStyle: "short" })

    return (
        <div className="user_rating">
            {productData.photo && 
                <img 
                    src={`${import.meta.env.PUBLIC_FRONTEND_CDN_URL}/products/${productData.id}/${productData.photo.replace("/", "⁄")}.jpg?size=256`}
                    width={92}
                    height={92}
                    alt={`Foto do produto "${productData.name}"`}
                />
            }
            <div className="content">
                <div className="header">
                    <div>
                        <h2>{productData.name}</h2>
                        <p>Seller name</p>
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