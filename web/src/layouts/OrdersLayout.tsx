import "@styles/layouts/orders.scss";

export default function OrdersLayout(props: { children: JSX.Element | JSX.Element[] }) {
    return (
        <section className="orders_container">
            {
                props.children
            }
        </section>
    )
}