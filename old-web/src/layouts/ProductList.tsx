import "../style/layouts/productlist.scss";
import Product from "../components/ProductList/Product";
import { useStore } from "@nanostores/react";
import Products from "../stores/Products";
import call_all from "../api/call_all";

import { useContext, createContext, useState, useEffect, memo, useRef } from "react";
import type { MemoExoticComponent } from "react";
import type { WritableAtom } from "nanostores";
import get_user_recent_products from "../api/get_user_recent_products";
import get_user_most_requested_products from "../api/get_user_most_requested_products";
import get_products from "../api/get_products";

type MemoizedComponent = MemoExoticComponent<() => JSX.Element>

function getProducts(store: string, page: number) {
    switch(store) {
        case "recent":
            get_user_recent_products(page, 5)
            break
        case "most_requested":
            get_user_most_requested_products(page, 5)
        case "products":
            get_products()
    }
}

const ItemsPaginationContext = createContext<{
    slide_pos: number,
    setSlidePos: React.Dispatch<React.SetStateAction<number>>,

    page: number,
    setPage: React.Dispatch<React.SetStateAction<number>>,

    nextArrowRef: React.MutableRefObject<HTMLDivElement>,
    prevArrowRef: React.MutableRefObject<HTMLDivElement>
}>({
    slide_pos: undefined,
    setSlidePos: undefined,

    page: undefined,
    setPage: undefined,

    nextArrowRef: undefined,
    prevArrowRef: undefined
})

const itemsContext = createContext<{
    container_id: string,

    items: {
        [key: string]: { pos: number, memo: MemoizedComponent }
    },
    setItems: React.Dispatch<React.SetStateAction<unknown>>,

    currentItemsRaw: any[],
    setItemsRaw: React.Dispatch<React.SetStateAction<unknown>>,
}>({
    container_id: undefined,

    items: {},
    setItems: undefined,

    currentItemsRaw: undefined,
    setItemsRaw: undefined,
}) // valores padrões podem ser nulos

const imagesContext = createContext<{
    Star_image: JSX.Element,
    Location_image: JSX.Element,
    ArrowBack_image: JSX.Element,
    ArrowNext_image: JSX.Element
}>({} as any)

function ProductsProvider({ children }) {
    const [items, setItems] = useState({})
    const [currentItemsRaw, setItemsRaw] = useState([])
    const { container_id } = useContext(itemsContext)

    return (
        <itemsContext.Provider value={{ container_id, items, setItems, currentItemsRaw, setItemsRaw }}>
            {children}
        </itemsContext.Provider>
    )
}

function ProductsUpdater(props: { store: string }) {
    const store = Products[props.store] as WritableAtom
    const { setItemsRaw } = useContext(itemsContext)

    const product_type_store = Products.product_type

    useEffect(() => {
        store.listen((v) => {
            setItemsRaw(v)
        })

        product_type_store.listen((v) => {

            getProducts(props.store, 1)
        })
    }, [])

    return <></>
}

function Items(props: { store: string }) {
    const { items, setItems, currentItemsRaw, container_id } = useContext(itemsContext)
    let i = 0

    useEffect(() => {
        const newItems = { ...items };

        // Adiciona novos itens ao objeto 'newItems' sem causar re-renderizações desnecessárias
        currentItemsRaw.forEach((item) => {
            if(item) {
                const index = i
                if (!newItems[item.id]) {
                    newItems[item.id] = {pos: i, memo: memo(() => (<Product item={item} i={index} />))}
                    i += 1
                }
            }
        })

        const newKeys = Object.keys(newItems)

        let isEqual = true

        for(const key of newKeys) {
            const currentValue = items[key]

            if(!currentValue) {
                isEqual = false
                break;
            }
        }

        if(!isEqual) {
            setItems(newItems);
        }

    }, [currentItemsRaw])

    const sortedItems = Object.entries(items)
        .sort((a, b) => a[1].pos - b[1].pos);

    return (
        <>
            {
                sortedItems.map(([itemKey, item]) => {
                    const ItemComponent = items[itemKey]["memo"]

                    return <ItemComponent key={`${container_id}-${itemKey}`}></ItemComponent>
                })
            }
        </>
    )
}

const Location_Img = memo(({ location_image_src }: any) => {
    return (
        <img
            src={location_image_src}
            alt="Ícone de GPS, ao lado está a sua distância até o vendedor, em quilômetros."
            width={15}
            height={15}
        />
    )
}, (prev, next) => true)

const ArrowBack = memo(({ arrow_image_src }: any) => {
    return (
      <img src={arrow_image_src}
        alt="Seta para direita, clique para passar os elementos do carrossel."
        width={35}
        height={35}
        style={{ transform: "rotate(180deg)" }}
      />
    );
}, (prev, next) => true);

const StarImage = memo(({ star_image_src }: any) => {
    return (
      <img
        src={star_image_src}
        alt="Imagem de uma estrela, ao lado direito está indicando o número de avaliações."
        width={12}
        height={12}
      />
    );
}, (prev, next) => true);

const ArrowNext = memo(({ arrow_image_src }: any) => {
    return (
      <img src={arrow_image_src}
        alt="Seta para direita, clique para passar os elementos do carrossel."
        width={35}
        height={35}
      />
    );
}, (prev, next) => true);

function PaginationProvider(props: { arrow_image_src: string, store: string, children }) {
    const [slide_pos, setSlidePos] = useState(0)
    const [firstLoad, setFirstLoad] = useState(false)
    const [page, setPage] = useState(0)
    const nextArrowRef = useRef(null)
    const prevArrowRef = useRef(null)

    const { ArrowBack_image, ArrowNext_image } = useContext(imagesContext)

    useEffect(() => {
        prevArrowRef.current.addEventListener("click", () => {
            if(slide_pos != 0) {
                setSlidePos(slide_pos - 2)
            } else {
                setSlidePos(0)
            }
        })

        nextArrowRef.current.addEventListener("click", () => {
            setSlidePos(slide_pos + 2)
        })
    }, [])

    useEffect(() => {
        const rawItems = Products[props.store].get()

        if(slide_pos >= rawItems.length - 3) {
            if(rawItems.length < 1) {
                if(firstLoad) {
                    setPage(page + 1)
                    return;
                }
            } else {
                return
            }

            setPage(page + 1)

        }
    }, [slide_pos])

    useEffect(() => {
        if(page < 1) {
            return;
        }
        getProducts(props.store, page)
    }, [page])

    return (
        <ItemsPaginationContext.Provider value={{
            slide_pos: slide_pos,
            setSlidePos: setSlidePos,
            page,
            setPage,
            nextArrowRef,
            prevArrowRef
        }}>
            <div className="arrow_container arr-prev" ref={prevArrowRef}>
                {ArrowBack_image}
            </div>
                {props.children}
            <div className="arrow_container arr-next" ref={nextArrowRef}>
                {ArrowNext_image}
            </div>
        </ItemsPaginationContext.Provider>
    )
}

export default function ProductList(props: { store: string, star_image_src: string, location_image_src: string, arrow_image_src: string }) {
    return (
        <div className="products">
            <imagesContext.Provider value={{
                Location_image: <Location_Img location_image_src={props.location_image_src}/> as any,
                ArrowBack_image: <ArrowBack arrow_image_src={props.arrow_image_src} /> as any,
                ArrowNext_image: <ArrowNext arrow_image_src={props.arrow_image_src} /> as any,
                Star_image: <StarImage star_image_src={props.star_image_src} /> as any
            }}>
                <ProductsProvider>
                    <PaginationProvider {...props}>
                        <div className="product_list">
                            <div className="product_container">
                                <Items {...props}/>
                            </div>
                            <ProductsUpdater store={props.store} />
                        </div>
                    </PaginationProvider>
                </ProductsProvider>
            </imagesContext.Provider>
        </div>
    )
}
export {
    itemsContext,
    imagesContext,
    ItemsPaginationContext
}