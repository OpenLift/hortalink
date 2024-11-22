import "@styles/layouts/schedules.scss";

export default function SellerSchedules(props: { children: JSX.Element | JSX.Element[] }) {
    return (
        <section className="seller_schedules">
            { props.children }
        </section>
    )
}