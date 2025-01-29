import "@styles/pages/users/@me/products/edit_form.scss";

import type { Product, ProductFullTextSearch } from "@interfaces/Product";
import { useContext, useEffect, useRef, useState } from "react";
import APIWrapper, { RequestAPIFrom } from "@HortalinkAPIWrapper";
import type { ProductImage } from "./SellerProductsEditContext";
import SellerProductsEditContext from "./SellerProductsEditContext";

function ProductImages() {
    const context = useContext(SellerProductsEditContext)

    const inputRef = useRef<HTMLInputElement>()
    const buttonRef = useRef<HTMLButtonElement>()

    const [hrefs, setHrefs] = useState(() => context.currentImages.current)

    useEffect(() => {
        buttonRef.current.addEventListener("click", () => {
            if(hrefs.length >= 5) {
                return alert("O limite de imagens é 5.")
            }
            inputRef.current.click()
        })

        inputRef.current.addEventListener("change", () => {
            const files = inputRef.current.files

            for(const file of files) {
                const reader = new FileReader()

                const handler = () => {
                    setHrefs((v => [ ...v, { src: reader.result as string }]))
                    context.currentImages.current.push({ src: reader.result as string })
                    reader.removeEventListener("load", handler)
                }

                reader.addEventListener("load", handler)
                reader.readAsDataURL(file)
            }
        })
    }, [])

    return (
        <>
            <input type="file" accept="image/jpeg, image/jpg, image/png" style={{ display: "none" }} ref={inputRef} />

            <button className="image" type="button" ref={buttonRef}>
                <img
                    src="/assets/plus.svg"
                    width={38}
                    height={38}
                    alt="Foto do produto, clique para remover"
                />
            </button>
            {
                hrefs.map((href) => {
                    return (
                        <div className="image" key={href.src}>
                            <button type="button" className="photo_button" onClick={() => {
                                    setHrefs(currentHrefs => currentHrefs.filter(h => h.src !== href.src))
                                    context.currentImages.current = context.currentImages.current.filter(h => h.src !== href.src)
                                    // TODO: terminar a parte de fazer um PATCH para a API caso o produto já exista.
                                    // wip: não esqueça de consultar o docs/api.md, os parametros no patch são diferentes para imagens e schedules.
                                    if(href.id) {
                                        context.toRemoveImages.current.push(href.id)
                                    }
                                }}>
                                <img
                                    src={href.src}
                                    width={128}
                                    height={128}
                                    alt="Botão contendo uma imagem de sinal de mais, clique para adicionar fotos do produto"
                                    className="photo product_image_preview"
                                />
                                <img
                                    src="/assets/X-white.svg"
                                    width={38}
                                    height={38}
                                    alt="Botão contendo uma imagem de sinal de X, clique para remover a foto"
                                    className="close"
                                />
                            </button>
                        </div>
                    )
                })
            }
        </>
    )
}

export default function SellerProductsEditForm(props: { seller_id: number, product?: Product, categories: ProductFullTextSearch[] }) {
    const editMode = !(props.product === undefined || props.product === null)
    
    const imagesHref = useRef<ProductImage[]>(props.product?.photos.map(p => {
        return {
            src: `${import.meta.env.PUBLIC_FRONTEND_CDN_URL}/products/${props.product.id}/${p.replace("/", "⁄")}.jpg?size=256`,
            id: p
        }
    }) || [])

    const toRemoveImages = useRef<string[]>([])
    const formRef = useRef<HTMLFormElement>()

    const wrapper = new APIWrapper(RequestAPIFrom.Client)

    async function submit() {
        const form = new FormData(formRef.current)
        const images = document.querySelectorAll<HTMLImageElement>(".product_image_preview")

        form.append("schedules_id", "7")
        form.append("schedules_id", "8")
        
        for(const image of images) {
            const request = await fetch(image.src)
            const blob = await request.blob()

            if(editMode) {
                form.append("add_photos", blob)
            } else {
                form.append("photos", blob)
            }
        }

        if(editMode) {
            for(const photoID of toRemoveImages.current) {
                form.append("remove_photos", photoID)
            } 
        }

        if(editMode) {
            await wrapper.editProduct(props.seller_id, props.product.id, form)
        } else {
            await wrapper.createProduct(props.seller_id, form)
        }

        window.location.href = "/users/@me/products"
    }

    return (
        <SellerProductsEditContext.Provider value={{ currentImages: imagesHref, toRemoveImages: toRemoveImages, editMode: editMode }}>
            <form className="product_edit_form" ref={formRef} onSubmit={(e) => {
                e.preventDefault()
                submit()
            }}>
                <h2>Imagens</h2>
                <section className="product_images">
                    <ProductImages />
                </section>
                <div className="line" />
                <h2>Produto</h2>
                <select className="product_type" name="product_id" defaultValue={props.product?.product?.id || null}>
                    {
                        props.categories.map((category, i) => (
                            <option key={`category-${category.category_id}-${i}`} value={category.product_id}>{category.product_name}</option>
                        ))
                    }
                </select>
                <section className="product_infos">
                    <div>
                        <h2>Valor</h2>
                        <input type="number" name="price" defaultValue={String(props.product?.price)?.replace(/,/g, ".") || ""} />
                    </div>
                    <div>
                        <h2>Em estoque</h2>
                        <input type="number" name="quantity" defaultValue={props.product?.quantity || ""} />
                    </div>
                    <div>
                        <h2>Qt. Por KG</h2>
                        <input type="number" name="unit_quantity" defaultValue={props.product?.unit_quantity || ""} />
                    </div>
                    <div>
                        <h2>Tipo</h2>
                        <select name="unit">
                            <option value={0}>kg</option>
                            <option value={1}>hg</option>
                            <option value={2}>dag</option>
                            <option value={3}>G</option>
                            <option value={4}>Cg</option>
                            <option value={5}>Mg</option>
                            <option value={6}>U</option>
                        </select>
                    </div>
                </section>
                <section className="description">
                    <h2>Descrição</h2>
                    <textarea name="description" placeholder="Descrição opcional do seu produto" defaultValue={props.product?.description || ""} />
                </section>
                <button type="submit">Salvar</button>
            </form>
        </SellerProductsEditContext.Provider>
    )
}