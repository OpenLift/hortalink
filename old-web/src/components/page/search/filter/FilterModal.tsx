import { createContext, memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import { SearchContext } from "../SearchContainer";
import Products from "../../../../stores/Products";

import { atom } from "nanostores";

import type { Filter } from "../../../../interfaces/ProductsFilter";

import { dayNumberToName } from "../../../../util/weekDays";

import { Component } from "react";
import type { WritableAtom } from "nanostores";
import { useStore } from "@nanostores/react";

type updateFilter = (newFilter: Partial<Filter>) => void

type setFilterAction = React.Dispatch<React.SetStateAction<Filter>>

const filterContext = createContext<{
    filter: WritableAtom<Filter>,
}>({
    filter: null
})

class StarImage extends Component<{ star_image_src: string }> {
    shouldComponentUpdate(nextProps: Readonly<{ star_image_src: string; }>, nextState: Readonly<{}>, nextContext: any): boolean {
        return false
    }

    render() {
        return (
            <img src={this.props.star_image_src} width={20} height={20} alt="Imagem de uma estrela" />
        )
    }
}

function FilterProviderStateComponent(props: { children: JSX.Element | JSX.Element[] } ) {
    const filter = atom(Products.products_filter.value)
    
    const { children } = props

    return (
        <filterContext.Provider value={{ filter: filter }}>
            {children}
        </filterContext.Provider>
    )
}

const FilterProvider = memo((props: { children: JSX.Element | JSX.Element[] }) => {
    return (
        <FilterProviderStateComponent>
            {props.children}
        </FilterProviderStateComponent>
    )
})

function FilterModal(props: { star_image_src: string }) {
    const Star = <StarImage star_image_src={props.star_image_src} />
    
    return <FilterProvider>
        <Modal Star={Star} />
    </FilterProvider>
}

const StarDiv = memo((props: { value: number, Star: JSX.Element }) => {
    const { filter } = useContext(filterContext)
    const divRef = useRef<HTMLDivElement>()

    console.log("star re-render")

    function ShowingController() {
        // special handler to avoid completely re-render of component

        useEffect(() => {
            filter.listen((v) => {
                //divRef.current.className = `star ${v.min_stars === props.value ? 'selected' : ''}`
            })
        }, [])

        return <></>
    }

    return (
        <>
            <div className="star" ref={divRef} onClick={() => {
                const new_filter = {...filter.value}
                filter.set({ ...new_filter, ...{ min_stars: props.value } })
            }}>
                {props.Star}
                <p>({props.value})</p>
            </div>
            <ShowingController />
        </>
    )
})

function DistanceSelector() {
    const { filter } = useContext(filterContext)
    const distanceRef = useRef<HTMLSelectElement>()

    console.log("distance re-render")

    useEffect(() => {
        const selectElement = distanceRef.current

        selectElement.addEventListener("change", (e) => {
            const target = e.target as HTMLSelectElement
            const distance = Number(target.value.replace(/[^0-9]/g, ''))
            
            const prev = {...filter.value}
            filter.set({ ...prev, ...{ distance: distance } })
        })
    }, [])

    return (
        <div className="distance centered">
            <label htmlFor="distance">Até: </label>
            <select id="distance" ref={distanceRef}>
                <option>45km</option>
                <option>75km</option>
            </select>
        </div>
    )
}

function CategorySelector() {
    const { filter } = useContext(filterContext)
    const filterValue = useStore(filter)

    function setFilter(data: { product_type: number }) {
        const prev = { ...filter.value }
        filter.set({ ...prev, ...{data} })
    }

    return (
        <div className="blocky_text centered">
            <div className={`text ${filterValue.product_type === 2 ? 'selected' : ''}`} onClick={() => setFilter({ product_type: 2 })}>
                <p>Raízes</p>
            </div>
            <div className={`text ${filterValue.product_type === 3 ? 'selected' : ''}`} onClick={() => setFilter({ product_type: 3 })}>
                <p>Folhas</p>
            </div>
            <div className={`text ${filterValue.product_type === 1 ? 'selected' : ''}`} onClick={() => setFilter({ product_type: 1 })}>
                <p>Frutas</p>
            </div>
        </div>
    )
}

function ValueRangeSelector() {
    const { filter } = useContext(filterContext)
    const filterValue = useStore(filter)

    const minRef = useRef<HTMLInputElement>()
    const maxRef = useRef<HTMLInputElement>()

    useEffect(() => {
        minRef.current.addEventListener("change", () => {
            if(minRef.current.value) {
                const prev = { ...filter.value }
                filter.set({ ...prev, ...{ min_price: Number(minRef.current.value) } })
            } else {
                if(filterValue.min_price) {
                    const current = {...filter.value}

                    delete current.min_price

                    filter.set(current)
                }
            }
        })

        maxRef.current.addEventListener("change", () => {
            if(maxRef.current.value) {
                const prev = { ...filter.value }
                filter.set({ ...prev, ...{ max_price: Number(maxRef.current.value) } })
            } else {
                if(filterValue.max_price) {
                    const current = { ...filter.value }

                    delete current.max_price

                    filter.set(current)
                }
            }
        })

        // mais pra frente vou de-duplicar isso aqui
    }, [])

    return (
        <div className="value_inputs centered">
            <div>
                <label htmlFor="min_value">Min: </label>
                <input type="number" ref={minRef}></input>
            </div>
            <div>
                <label htmlFor="max_value">Max: </label>
                <input type="number" ref={maxRef}></input>
            </div>
        </div>
    )
}

function DayOfWeekSelector() {
    const { filter } = useContext(filterContext)
    const filterValue = useStore(filter)

    const days = Array.from({ length: 6 }, (_, index) => index + 1)

    function setDayOfWeek(day: number) {
        const prev = { ...filter.value }
        
        filter.set({ ...prev, ...{ day_of_week: day } })
    }

    function DayOfWeek(props: { day: number, children: JSX.Element }) {
        const day = props.day

        return (
            <div className={`week_day ${filterValue.day_of_week === day ? 'selected' : ''}`} onClick={() => setDayOfWeek(day)}>
                {props.children}
            </div>
        )
    }

    return (
        <div className="week_days">
            {
                days.map((day) => (
                    <DayOfWeek day={day} key={`search-day-selector-${day}`}>
                        <p>{dayNumberToName[day]}</p>
                    </DayOfWeek>
                ))
            }
        </div>
    )
}

function TimesSelector() {
    const { filter } = useContext(filterContext)

    useEffect(() => {
        const inputs = document.querySelectorAll<HTMLInputElement>(".modal_time_input")

        for(const input of inputs) [
            input.addEventListener("change", () => {
                let key = input.id === "min_hour" ? 'start_time' : null

                if(!key) return

                if(input.value) {
                    const prev = { ...filter.value }
                    filter.set({ ...prev, ...{ [key]: input.value } })
                } else {
                    const current = { ...filter.value }

                    delete current[key]

                    filter.set(current)
                }
            })
        ]

    }, [])

    return (
        <div className="value_inputs centered">
            <div>
                <input className="modal_time_input" type="time" id="min_hour" />
            </div>
            <p>E</p>
            <div>
                <input className="modal_time_input" type="time" id="max_hour" />        
            </div>
        </div>
    )
}

function ConfirmFilterButton() {
    const { set_filter_modal_open } = useContext(SearchContext)
    const { filter } = useContext(filterContext)

    function confirmFilter() {
        Products.products_filter.set(filter.value)
        set_filter_modal_open(false)
    }

    return (
        <button className="confirm_btn centered" onClick={() => confirmFilter()}>
            Confirmar
        </button>
    )
}

function Modal(props: { Star: JSX.Element }) {
    //const { set_filter_modal_open} = useContext(SearchContext)

    const { Star } = props

    /*function StarDiv(props: { value: number }) {

        return (
            <div className="star" onClick={() => {
                updateFilter({ min_stars: props.value })
            }}>
                {Star}
                <p>({props.value})</p>
            </div>
        )
    }*/

    return (
        <div className="filter_modal">
            <div className="filter_modal_container">
                <h2>Filtros</h2>
                <div className="line" />
                <h3>Estrelas</h3>
                <div className="stairs">
                    <StarDiv value={5} Star={Star}/>
                    <StarDiv value={4} Star={Star}/>
                    <StarDiv value={3} Star={Star}/>
                    <StarDiv value={2} Star={Star}/>
                    <StarDiv value={1} Star={Star}/>
                </div>
                <h3>Distância</h3>
                <DistanceSelector />
                <h3>Categoria</h3>
                <CategorySelector />
                <h3>Faixa de valor</h3>
                <ValueRangeSelector />
                <h3>Dia da Semana</h3>
                <DayOfWeekSelector />
                <h3>Horário</h3>
                <TimesSelector />
                <ConfirmFilterButton />
            </div>
        </div>
    )
}

export default FilterModal