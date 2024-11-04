import { atom } from "nanostores";

enum Selection {
    Orders = 1,
    Ratings
}

export default {
    sectionSelection: atom<Selection>(Selection.Orders)
}

export {
    Selection
}