import { useStore } from "@nanostores/react";
import Products from "../../../../stores/Products";

export default function Categories(props: { category_list: { label: string, img_src: string, product_type: number }[] }) {
    const products = useStore(Products.search_result)

    return (
        <>
            {
                !products.length &&
                <>
                    <h1>Categorias</h1>
                    <section aria-label="Categorias">
                        <div className="circular_list">
                            <div className="circular_container">
                                {
                                    props.category_list.map((category, i) => (
                                        <div className="item" key={i} onClick={() => {
                                            Products.product_type.set(category.product_type)
                                        }}>
                                            <div className="img_container">
                                                <img
                                                    src={category.img_src}
                                                    width={165}
                                                    height={165}
                                                />
                                            </div>
                                            <p>{category.label}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </section>
                </>
            }
        </>
    )
}