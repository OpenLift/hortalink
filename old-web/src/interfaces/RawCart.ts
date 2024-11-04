interface RawCart {
    id: number,
    seller: CartSeller,
    amount: number,
    withdrawn: number,
    product: CartProduct
}

interface CartSeller {
    id: number,
    name: string,
    avatar?: string
}

interface CartProduct {
    id: number,
    name: string,
    price: number,
    photo: string,
    unit: string,
    dist?: number,

    product_name: string,
    product_id: string,
    withdrawn: number,

    order_id: number
}

export type {
    RawCart,
    CartSeller,
    CartProduct
}