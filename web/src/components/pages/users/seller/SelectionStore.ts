import { atom } from "nanostores";

enum Selection {
    Products = 1,
    Schedule,
    Ratings
}

export default {
    sectionSelection: atom<Selection>(Selection.Products)
}

export {
    Selection
}