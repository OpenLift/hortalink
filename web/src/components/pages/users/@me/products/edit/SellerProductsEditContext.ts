import React, { createContext } from "react";

type ProductImage = { src: string, id?: string }

export default createContext<{
    toRemoveImages: React.MutableRefObject<string[]>,
    currentImages: React.MutableRefObject<ProductImage[]>,
    editMode: boolean
}>({
    toRemoveImages: null,
    currentImages: null,
    editMode: null
})

export type {
    ProductImage
}