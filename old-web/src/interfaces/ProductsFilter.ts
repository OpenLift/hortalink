interface Filter {
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

export type {
    Filter
}