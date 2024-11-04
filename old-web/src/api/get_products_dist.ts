import request_api from "./request_api";
import Products from "../stores/Products";
import Geolocation from "../stores/Geolocation";

export default async function get_products_dist() {
    const url = new URL("http://localhost:321")
    const ids = []

    const position = Geolocation.position.get()

    if(!position?.length) {
        console.log("[ POSITION UPDATER ] - Posição não existe.")
        return;
    }

    const stores = [
        Products.most_requested,
        Products.recent,
        Products.products
    ]

    for(const store of stores) {
        for(const product of store.get()) {
            
            if(!ids.includes(product.id)) {
                ids.push(product.id)
            }
        }
    }

    if (ids.length == 0) { return }

    const request_data = await request_api(`/v1/products/dist?products_id=${JSON.stringify(ids)}&latitude=${position[0]}&longitude=${position[1]}`)
    const dists = {}

    for(const dist of request_data) {
        dists[dist.id] = dist.dist
    }

    Products.all_products_dist.set(dists)

    return request_data
}