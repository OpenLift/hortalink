import "../../../../../style/pages/users/utils/ratings_modal.scss";

import { useStore } from "@nanostores/react";
import { useState } from "react";
import get_product_ratings from "../../../../../api/get_product_ratings";

import Products from "../../../../../stores/Products";

export default function RatingsFilter(props: { filter_src: string, filter_solid_src: string, x_src: string, star_src: string }) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <img
                src={props.filter_src}
                alt="Filtro de avaliações"
                width={14}
                height={14}

                onClick={() => setOpen(!open)}
            />

            {
                open && <div className="modal_basis">
                    <div className="modal_container">
                        <div className="modal_content">
                            <div className="modal_header">
                                <h2 className="on_center">Filtros</h2>
                                <img
                                    src={props.x_src}
                                    alt="Clique aqui para fechar o modal"
                                    width={23}
                                    height={23}
                                    className="on_end"
                                    onClick={() => setOpen(!open)}
                                />
                            </div>
                            <div className="line" />
                            <div className="filter_options">
                                <p>Estrelas</p>
                                <div className="filters">
                                    <div className="filter">
                                        <img
                                            src={props.star_src}
                                            alt="5 estrelas"
                                            width={20}
                                            height={20}
                                        />
                                        <p>(5)</p>
                                    </div>
                                    <div className="filter">
                                        <img
                                            src={props.star_src}
                                            alt="4 estrelas"
                                            width={20}
                                            height={20}
                                        />
                                        <p>(4)</p>
                                    </div>
                                    <div className="filter">
                                        <img
                                            src={props.star_src}
                                            alt="3 estrelas"
                                            width={20}
                                            height={20}
                                        />
                                        <p>(3)</p>
                                    </div>
                                    <div className="filter">
                                        <img
                                            src={props.star_src}
                                            alt="2 estrelas"
                                            width={20}
                                            height={20}
                                        />
                                        <p>(2)</p>
                                    </div>
                                    <div className="filter">
                                        <img
                                            src={props.star_src}
                                            alt="1 estrela"
                                            width={20}
                                            height={20}
                                        />
                                        <p>(1)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}