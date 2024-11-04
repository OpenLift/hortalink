interface Rating {
    rating: number,
    ratings: {
        id: number,
        created_at: number,
        was_edited: boolean,
        rating: number,
        content: string,
        user: {
            id: number,
            name: string,
            avatar?: string
        }
    }[]
}

export type {
    Rating
}