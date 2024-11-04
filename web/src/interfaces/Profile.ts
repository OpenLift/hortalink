interface Profile {
    avatar?: string,
    following: number,
    id: number,
    is_seller: boolean,
    name: string,
    orders_made: number,
    roles: number[]
}

export type {
    Profile
}