import get_seller_products from "../../../../../../api/get_seller_products";

export default function ProductsWrap(props: { seller_id: string }) {
    get_seller_products(props.seller_id)   
    
    return <></>
}