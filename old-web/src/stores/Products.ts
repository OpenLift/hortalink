import { atom } from "nanostores";
import type { Rating } from "../interfaces/Rating";
import type { Product } from "../interfaces/Product";
import type { Filter } from "../interfaces/ProductsFilter";
import type { ProductResume } from "../interfaces/Product";

export default {
    recent: atom([]),
    most_requested: atom([]),
    searched: atom([]),
    search_result: atom<ProductResume[]>([]),
    current_product: atom<Product>(),
    current_product_quantity: atom(0),
    current_product_ratings: atom<Rating>(),
    all_products_dist: atom<{ [key: number]: number }>(),
    product_type: atom<number>(null),

    products: atom<Product[]>([]), // for selected products, ex: seller specific products.
    products_filter: atom<Filter>({
        page: 1,
        per_page: 10
    })
}