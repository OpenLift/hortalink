import type { Cart } from "../../../interfaces/Cart";
import type { CartGroup } from "../../../interfaces/CartGroup";
import type { RawCart } from "../../../interfaces/RawCart";
import CartData from "./CartData";

export default function CartGroup(props: { carts: Cart[] }) {
    const Carts: Cart[] = props.carts

    return (
        <>
            {
                Carts.map((cart, i) => (
                    <section className="cart-container" key={i}>
                        <div className="header">
                            <div className="info">
                                <div className="image">
                                    <img
                                        width={53}
                                        height={53}
                                        alt={`Foto de perfil do vendedor ${cart.user.name}`}
                                        src={`${import.meta.env.PUBLIC_FRONTEND_CDN_URL}/avatars/${cart.user.id}/${cart.user.avatar}.jpg?size=256`}
                                    />
                                </div>
                                <h2>{cart.user.name}</h2>
                            </div>
                            <div className="see-profile">
                                <a>Ver perfil</a>
                            </div>
                        </div>
                        <div className="content">
                            {
                                cart.products.map((cart, i) => (
                                    <CartData 
                                        cartData={cart}
                                        key={i}
                                    />
                                ))
                            }
                        </div>
                    </section>
                ))
            }
        </>
    )
}