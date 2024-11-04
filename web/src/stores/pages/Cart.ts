import { atom } from "nanostores";
import type { Cart } from "@interfaces/Product";

const UserCart = atom<Cart[]>()

export {
    UserCart
}