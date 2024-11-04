import { useState } from "react";
import { useStore } from "@nanostores/react";
import Products from "../../../../stores/Products";

export default function SearchResults(props: { id: string, set_value: React.Dispatch<React.SetStateAction<{ value: string, product_id: number }>> }) {
    const [selectedIndex, setSelectedIndex] = useState<number>(null)
    const results = useStore(Products.searched)
    
    return (
        <section className="selection_container">
            <section className="selection" role="listbox" aria-multiselectable={"false"}>
                {
                    results && results.map((item, i) => (
                        <div 
                            className="option"
                            role="option"
                            aria-selected={selectedIndex === i}
                            key={`${props.id}-${i}`}
                            tabIndex={0}
                            onClick={() => {
                                setSelectedIndex(i)
                                props.set_value({
                                    value: item.product_name,
                                    product_id: item.product_id
                                })
                            }}
                        >{item.product_name}</div>
                    ))
                }
            </section>
        </section>
    )
}