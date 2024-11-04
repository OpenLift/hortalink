import { atom } from "nanostores";

enum PageType {
    SearchHome = 1,
    SearchResults
}

export default {
    pageType: atom<PageType>(PageType.SearchHome)
}

export {
    PageType
}