import { useStore } from "@nanostores/react";
import stores from "../../../../../stores/Products";
import Quantity from "./Quantity";

export default function QuantitySwitcher() {
    const amount = useStore(stores.current_product_quantity)
    
    return (
        <section className="quantity">
            <p>Quantidade</p>
            <div className="content">
                <button onClick={() => {
                    if(amount > 0) {
                        stores.current_product_quantity.set(amount - 1)
                    }

                }}>-</button>
                <Quantity />
                <button onClick={() => {
                    stores.current_product_quantity.set(amount + 1)
                }}>+</button>
            </div>
        </section>
    )
}