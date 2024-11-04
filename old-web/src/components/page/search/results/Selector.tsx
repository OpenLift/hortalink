import "../../../../style/pages/search/results_selector.scss";
import { SearchResultContext } from "./SearchResultContainer";

import { useContext } from "react";

export default function Selector() {
    const { set_result_type } = useContext(SearchResultContext)

    return (
        <section className="results_selector">
            <p tabIndex={0}>Produtos</p>
            <p tabIndex={0}>Usuários</p>
        </section>
    )
}