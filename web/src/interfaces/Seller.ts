import type { Product } from "./Product";
import type { Profile } from "./Profile";

interface SellerProfile extends Profile {
    followers: number,
    orders_received: number
}

interface Seller {
    profile: SellerProfile
    products: Product[]
}

export type {
    Seller,
    SellerProfile
}