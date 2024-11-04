import { useState, useEffect, createContext, useContext } from "react";
import { filter, screen, Screen } from "./Search";
import { useStore } from "@nanostores/react";

import { dayNumberToName } from "@utils/weekDays";
import type { ProductFilter } from "@interfaces/Product";

const FilterContext = createContext<{
    filter_preview: ProductFilter,
    set_filter_preview: React.Dispatch<React.SetStateAction<ProductFilter>>,
    close: React.Dispatch<React.SetStateAction<boolean>>
}>({
    filter_preview: null,
    set_filter_preview: null,
    close: null
})

export default function FilterIcon() {
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const currentScreen = useStore(screen)

    if(currentScreen === Screen.Results || currentScreen === Screen.Menu) {
        return (
            <>
                <div className="icon filter_icon" onClick={() => setModalOpen(true)}>
                    <img
                        src="/assets/filter-thin.svg"
                        alt="Ícone de filtro. Clique para abrir as opções de filtragem."
                        width="28"
                        height="28"
                    />
                </div>
                {
                    modalOpen && <FilterModal close={setModalOpen}/>
                }
            </>
        )
    } else {
        return <></>
    }
}

function FilterModal(props: { close: React.Dispatch<React.SetStateAction<boolean>> }) {
    const currentFilter = filter.get()
    const [preview, setPreview] = useState<ProductFilter>(currentFilter)

    return (
        <section className="filter_modal">
            <div className="modal_content">
                <section className="modal_header" onClick={() => props.close(false)}>
                    <h2>Filtros</h2>
                    <img
                        src="/assets/X.svg"
                        width={23}
                        height={23}
                        alt="Imagem de um X. Clique para fechar a seção de filtros."
                        className="close"
                    />
                </section>
                <FilterContext.Provider value={{ filter_preview: preview, set_filter_preview: setPreview, close: props.close }}>
                    <div>
                        <h3>Estrelas</h3>
                        <div className="stairs">
                            <StarDiv value={5} />
                            <StarDiv value={4} />
                            <StarDiv value={3} />
                            <StarDiv value={2} />
                            <StarDiv value={1} />
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
                </FilterContext.Provider>
            </div>
        </section>
    )
}

function StarDiv(props: { value: number }) {
    const context = useContext(FilterContext)

    function setMinStars() {
        context.set_filter_preview((prev) => {
            return { ...prev, min_stars: props.value }
        })
    }

    return (
        <div className={`star ${context.filter_preview?.min_stars === props.value ? "selected" : ""}`} onClick={setMinStars}>
            <img
                src="/assets/star.svg"
                width={20}
                height={20}
            />
            <p>({props.value})</p>
        </div>
    )
}

function DistanceSelector() {
    const context = useContext(FilterContext)

    function setDistance(element: HTMLSelectElement) {
        context.set_filter_preview((prev) => {
            return {...prev, distance: Number(element.value)}
        })
    }

    return (
        <div className="distance centered">
            <label htmlFor="distance">Até: </label>
            <select id="distance" onChange={(e) => {
                setDistance(e.currentTarget)
            }}>
                <option value={45}>45km</option>
                <option value={75}>75km</option>
            </select>
        </div>
    )
}

function CategorySelector() {
    const context = useContext(FilterContext)

    function setCategory(product_type: number) {
        context.set_filter_preview((prev) => {
            return {...prev, product_type}
        })
    }

    //2,3,1
    return (
        <div className="blocky_text centered">
            <div className={`text ${context.filter_preview?.product_type == 2 ? "selected" : ""}`} onClick={() => setCategory(2)}>
                <p>Raízes</p>
            </div>
            <div className={`text ${context.filter_preview?.product_type == 3 ? "selected" : ""}`} onClick={() => setCategory(3)}>
                <p>Folhas</p>
            </div>
            <div className={`text ${context.filter_preview?.product_type == 1 ? "selected" : ""}`} onClick={() => setCategory(1)}>
                <p>Frutas</p>
            </div>
        </div>
    )
}

function ValueRangeSelector() {
    const context = useContext(FilterContext)

    function setMinValue(element: HTMLInputElement) {
        context.set_filter_preview((prev) => {
            return {...prev, min_price: Number(element.value)}
        })
    }

    function setMaxValue(element: HTMLInputElement) {
        context.set_filter_preview((prev) => {
            return {...prev, max_price: Number(element.value)}
        })
    }

    return (
        <div className="value_inputs centered">
            <div>
                <label htmlFor="min_value">Min: </label>
                <input type="number" onChange={(e) => setMinValue(e.currentTarget)}></input>
            </div>
            <div>
                <label htmlFor="max_value">Max: </label>
                <input type="number" onChange={(e) => setMaxValue(e.currentTarget)}></input>
            </div>
        </div>
    )
}

function DayOfWeekSelector() {
    const context = useContext(FilterContext)

    const days = Array.from({ length: 6 }, (_, index) => index + 1)

    function DayOfWeek(props: { day: number, children: JSX.Element }) {
        const day = props.day

        return (
            <div className={`week_day ${context.filter_preview?.day_of_week === day ? "selected" : ""}`} onClick={() => setDayOfWeek(props.day)}>
                {props.children}
            </div>
        )
    }

    function setDayOfWeek(day: number) {
        context.set_filter_preview((prev) => {
            return {...prev, day_of_week: day}
        })
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
    const context = useContext(FilterContext)

    function confirmFilter() {
        filter.set(context.filter_preview)
        context.close(false)
    }

    return (
        <button className="confirm_btn centered" onClick={confirmFilter}>
            Confirmar
        </button>
    )
}