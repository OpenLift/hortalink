import { useStore } from "@nanostores/react"
import SelectionStore, { Selection } from "./SelectionStore";

export default function Selector() {
    const selected = useStore(SelectionStore.sectionSelection)

    return (
        <div className="selector">
            <p className={`${selected === Selection.Products ? 'selected' : ''}`} onClick={() => { SelectionStore.sectionSelection.set(Selection.Products) }}>Produtos</p>
            <p className={`${selected === Selection.Schedule ? 'selected' : ''}`} onClick={() => { SelectionStore.sectionSelection.set(Selection.Schedule) }}>Agenda</p>
            <p className={`${selected === Selection.Ratings ? 'selected' : ''}`} onClick={() => { SelectionStore.sectionSelection.set(Selection.Ratings) }}>Avaliações</p>
        </div>
    )
}