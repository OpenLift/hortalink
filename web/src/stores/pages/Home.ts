import { atom } from "nanostores";
import type { Product } from "@interfaces/Product";

export default {
    Products_Recent: atom<Product[]>([]),
    Products_MoreOrders: atom<Product[]>([])
}