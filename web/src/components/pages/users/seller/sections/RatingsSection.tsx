import SelectionStore, { Selection } from "../SelectionStore";

import UserRatings from "@layouts/UserRatings";
import UserRating from "@components/UserRating";
import { useStore } from "@nanostores/react";
import type { IndividualRating } from "@interfaces/Product";
import ResumedUserRating from "@components/ResumedUserRating";

export default function SellerRatingsSection(props: { ratings: IndividualRating[] }) {
    const selection = useStore(SelectionStore.sectionSelection)
    const { ratings } = props

    if(selection === Selection.Ratings) {
        return (
            <UserRatings>
                {
                    ratings.map(rating => {
                        return <ResumedUserRating rating={rating} key={`seller-ratings-${rating.id}`} />
                    })
                }
            </UserRatings>
        )
    } else {
        return <></>
    }
}