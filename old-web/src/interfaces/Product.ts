interface Product {
    product: {
        id: number,
        product: {
            id: number,
            name: string
        },
        photos: string[],
        quantity: number,
        price: number,
        rating: number,
        rating_quantity: number,
        description: string,
        unit: string,
        unit_quantity: number
    },
    schedules: ProductSchedule[],
    seller: Seller
}

interface ProductResume {
    id: number,
    product: {
        id: number,
        name: string
    },
    photos: string[],
    quantity: number,
    price: number,
    rating: number,
    rating_quantity: number,
    description: string,
    unit: string,
    unit_quantity: number
}

interface ProductSchedule {
    id: number,
    address: string,
    start_time: string,
    end_time: string,
    day_of_week: number
}

interface Seller {
    id: number,
    name: string,
    avatar: string
}

export type {
    Product,
    ProductSchedule,
    Seller,
    ProductResume
}