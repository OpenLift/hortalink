import { useEffect } from "react";
import Geolocation from "../../stores/Geolocation";
import Products from "../../stores/Products";
import get_products_dist from "../../api/get_products_dist";

export default function WatchProductsDistance() {
    useEffect(() => {
        Geolocation.position.listen(() => {
            if(Products.search_result.value?.length) {
                
            } else {
                get_products_dist()
            }
        })
    }, [])
    
    return <></>
}