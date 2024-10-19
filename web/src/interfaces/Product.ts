interface Product {
    id: number,
    product: {
        id: number,
        name: string
    },
    photos: string[],
    photo?: string,
    quantity: number,
    price: number,
    rating: number,
    rating_quantity: number,
    description: string,
    unit: string,
    unit_quantity: number

    seller_id: number
}

interface DetailedProduct {
    product: {
        id: number,
        product: {
            id: number,
            name: string
        },
        photos: string[],
        photo?: string,
        quantity: number,
        price: number,
        rating: number,
        rating_quantity: number,
        description: string,
        unit: string,
        unit_quantity: number
    
        seller_id: number
    },
    seller: ProductSeller,
    schedules: number[]
}

interface ProductSeller {
    id: number,
    name: string,
    avatar: string
}

interface ProductFilter {
    max_price?: number
    min_price?: number
    min_stars?: number
    product_type?: number
    start_time?: string
    product_id?: number
    day_of_week?: number
    page: number
    per_page: number
    latitude?: string
    longitude?: string,
    distance?: number
}

interface ProductFullTextSearch {
    product_id: number,
    product_name: string,
    alias: string[],
    category_name: string,
    category_id: number
}

interface Rating {
    id: number;
    created_at: number;
    was_edited: boolean;
    rating: number;
    content: string;
    user: ProductSeller;
}
  
interface FullRating {
    rating: number;
    ratings: Rating[];
}

export type {
    Product,
    ProductFilter,
    ProductFullTextSearch,
    DetailedProduct,
    ProductSeller,
    Rating,
    FullRating
}