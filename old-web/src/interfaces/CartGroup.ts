import type { Cart } from "./Cart";
import type { CartSeller } from "./RawCart";

interface CartGroup {
    user: CartSeller,
    products: Cart[]
}

export type {
    CartGroup
}