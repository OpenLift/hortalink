import { useStore } from "@nanostores/react";
import stores from "../../../../../stores/Products";

export default function Quantity() {
    const quantity = useStore(stores.current_product_quantity)

    return <>{quantity}</>
}