import "../style/layouts/unpaginatedproductlist.scss";
import UnpaginatedProduct from "../components/ProductList/UnpaginatedProduct";
import Products from "../stores/Products";

import { useContext, createContext, useState, useEffect, memo, useRef } from "react";
import type { MemoExoticComponent } from "react";
import type { WritableAtom } from "nanostores";
import get_user_recent_products from "../api/get_user_recent_products";
import get_user_most_requested_products from "../api/get_user_most_requested_products";
import get_products from "../api/get_products";
import UnpaginatedColumnProduct from "../components/ProductList/UnpaginatedColumnProduct";

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
            break;
        case "search_result":
            get_products("search_result")
            break;
    }
}

type CacheCallback = (item: any) => boolean

const itemsContext = createContext<{
    container_id: string,
    
    items: {
        [key: string]: MemoizedComponent
    },
    setItems: React.Dispatch<React.SetStateAction<unknown>>,
    
    currentItemsRaw: any[],
    setItemsRaw: React.Dispatch<React.SetStateAction<unknown>>,
    
    cacheCallback?: CacheCallback,
    useCache?: boolean
}>({
    container_id: undefined,

    items: {},
    setItems: undefined,
    
    currentItemsRaw: undefined,
    setItemsRaw: undefined,

    cacheCallback: null,
    useCache: false
}) // valores padrões podem ser nulos

const imagesContext = createContext<{
    Star_image: JSX.Element,
    Location_image: JSX.Element,
    ArrowBack_image: JSX.Element,
    ArrowNext_image: JSX.Element,
    Filter_Image: JSX.Element
}>({} as any)

function ProductsProvider({ children, useCache }) {
    const [items, setItems] = useState({})
    const [currentItemsRaw, setItemsRaw] = useState([])
    const { container_id } = useContext(itemsContext)

    return (
        <itemsContext.Provider value={{ container_id, items, setItems, currentItemsRaw, setItemsRaw, useCache: useCache || false }}>
            {children}
        </itemsContext.Provider>
    )
}

function ProductsUpdater(props: { store: string }) {
    const store = Products[props.store] as WritableAtom
    const { setItemsRaw } = useContext(itemsContext)

    useEffect(() => {
        store.listen((v) => {
            setItemsRaw(v)
        })
    }, [])

    return <></>
}

function Items(props: { store: string, isColumn?: boolean }) {
    const { items, setItems, useCache, currentItemsRaw, container_id } = useContext(itemsContext)
    let i = 0

    useEffect(() => {
        const newItems = useCache ? { ...items } : {} /* objeto vazio se useCache for desativado, re-renderiza os componentes sempre */;

        // Adiciona novos itens ao objeto 'newItems' sem causar re-renderizações desnecessárias
        currentItemsRaw.forEach((item) => {
            if(item) {
                const index = i
                if (!newItems[item.id]) {
                    newItems[item.id] = !props.isColumn ? memo(() => (<UnpaginatedProduct item={item} i={index} />)) : memo(() => ( <UnpaginatedColumnProduct item={item} /> ))
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

    return (
        <>
            {
                Object.keys(items).map(itemKey => {
                    const ItemComponent = items[itemKey]
  
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

const FilterImage = memo(({filter_image_src}: any) => {
    return (
        <img src={filter_image_src} 
            alt="Ícone de filtro"
            width={35}
            height={35}
        />
    )
}, (prev, next) => true)

export default function UnpaginatedProductList(props: { store: string, cacheCallback?: CacheCallback, useCache?: boolean, noInitialFetch?: boolean, isColumn?: boolean, star_image_src: string, location_image_src: string, arrow_image_src: string, filter_image_src: string }) {
    useEffect(() => {
        getProducts(props.store, 1)
    }, [])
    
    return (
        <div className="products">
            <imagesContext.Provider value={{
                Location_image: <Location_Img location_image_src={props.location_image_src}/> as any,
                ArrowBack_image: <ArrowBack arrow_image_src={props.arrow_image_src} /> as any,
                ArrowNext_image: <ArrowNext arrow_image_src={props.arrow_image_src} /> as any,
                Star_image: <StarImage star_image_src={props.star_image_src} /> as any,
                Filter_Image: <FilterImage filter_image_src={props.filter_image_src} /> as any
            }}>
                <ProductsProvider useCache={props.useCache}>
                    <div className="product_list">
                        <div className="product_container" style={props.isColumn ? { flexDirection: "column" } : {}}>
                            <Items {...props}/>
                        </div>
                        <ProductsUpdater store={props.store} />
                    </div>
                </ProductsProvider>
            </imagesContext.Provider>
        </div>
    )
}

export type {
    CacheCallback
}

export {
    itemsContext,
    imagesContext
}