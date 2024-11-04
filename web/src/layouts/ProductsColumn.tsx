import "@styles/layouts/products.scss";

export default function ProductsColumn(props: { children: JSX.Element | JSX.Element[] }) {
    return (
        <section className="products_column">
            {props.children}
        </section>
    )
}