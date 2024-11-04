import type { CartProduct, CartSeller } from "./RawCart"

interface CartProductWithAmount extends CartProduct {
    amount: number
}

interface Cart {
    user: CartSeller,
    products: CartProductWithAmount[]
}

export type {
    Cart,
    CartProductWithAmount
}