import { useEffect, useState } from "react";
import Products from "../../../../stores/Products";
import SearchTypes from "../../../../api/searchTypes";
import SearchResults from "./SearchResults";
import call_all from "../../../../api/call_all";

import { useStore } from "@nanostores/react";

export default function Search(props: { search_icon_url: string }) {
    const results = useStore(Products.searched)
    const [search_value, setSearchValue] = useState<{ value: string, product_id: number }>(null)
    
    useEffect(() => {
        const icon_box = document.querySelector<HTMLDivElement>(".search_bar .icon_box")
        const input = document.querySelector<HTMLInputElement>(".search_bar input")

        icon_box.addEventListener("click", async () => {
            const query = input.value
            const result = await SearchTypes(query)

            Products.searched.set(result)
        })
    }, [])

    useEffect(() => {
        if(!search_value) return;
        const input = document.querySelector<HTMLInputElement>(".search_bar input")

        input.value = search_value.value
        Products.searched.set([])

        call_all(undefined, search_value.product_id, 1, 10)
    }, [search_value])

    return (
        <>
            <section className="search_bar">
                <input type="text" placeholder="Procurar por..." />
                <div className="icon_box">
                    <img
                        src={props.search_icon_url}
                        alt="Ícone de lupa, ao ser clicado, pesquisa o que você escreveu no input de texto."
                        width={32}
                        height={32}
                        style={{ transform: "scale(1.25) translateX(-5px)" }}
                    />
                </div>
            </section>
            {
                results?.length > 0 && 
                <SearchResults id="results" set_value={setSearchValue}/>
            }
            <div className="border" style={{ visibility: `${results.length ? "hidden" : "visible"}` }} />
        </>
    )
}