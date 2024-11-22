import "@styles/layouts/user_ratings.scss";

export default function UserRatings(props: { children: JSX.Element | JSX.Element[] }) {
    return (
        <section className="user_ratings">
            {props.children}
        </section>
    )
}