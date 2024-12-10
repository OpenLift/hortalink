import type { WritableAtom } from "nanostores";
import type { Product, ProductFilter } from "@interfaces/Product";

import { atom } from "nanostores";

type SearchFilter = WritableAtom<ProductFilter>
interface ProductSelector {
    product_name: string,
    product_id: number,
    onlySeller: boolean
}

interface UserResults {
    id: number
    name: string
    avatar: string,
    followers: number,
    orders_received: number
}

enum Screen {
    Home = 1,
    Menu,
    Results
}

const filter = atom<ProductFilter>()
const screen = atom<Screen>(Screen.Home)
const product_names = atom<ProductSelector[]>([])
const products_result = atom<Product[]>([])
const query = atom<string>("")

export type {
    SearchFilter,
    ProductSelector,
    UserResults
}

export {
    filter,
    screen,
    Screen,
    product_names,
    products_result,
    query
}