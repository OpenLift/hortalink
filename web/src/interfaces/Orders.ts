interface Order {
    id: number,
    amount: number,
    product: {
        id: number,
        name: string,
        photo: string
    },
    status: number
}

export type {
    Order
}