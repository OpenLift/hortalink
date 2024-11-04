import { createContext, useState } from "react";
import type { Filter } from "../../../../interfaces/ProductsFilter";
import { SearchContext } from "../SearchContainer";

interface Setters {
    set_result_type: React.Dispatch<React.SetStateAction<ResultType>>
}

enum ResultType {
    Products = 1,
    Users
}

const SearchResultContext = createContext<Setters & { store: string, result_type: ResultType }>({
    result_type: null,
    set_result_type: null,
    store: null
})

export default function SearchResultContainer({ children, store }: { children: JSX.Element[], store: string }) {
    const [result_type, set_result_type] = useState<ResultType>(ResultType.Products)

    return (
        <>
            <SearchResultContext.Provider value={{ store, result_type, set_result_type }}>
                {children}
            </SearchResultContext.Provider>
        </>
    )
}

export {
    SearchResultContext,
    ResultType
}