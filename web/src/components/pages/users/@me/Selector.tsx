import { useStore } from "@nanostores/react"
import SelectionStore, { Selection } from "@stores/pages/Users_@me";

export default function Selector() {
    const selected = useStore(SelectionStore.sectionSelection)

    return (
        <div className="selector">
            <p className={`${selected === Selection.Orders ? 'selected' : ''}`} onClick={() => { SelectionStore.sectionSelection.set(Selection.Orders) }}>Pedidos</p>
            <p className={`${selected === Selection.Ratings ? 'selected' : ''}`} onClick={() => { SelectionStore.sectionSelection.set(Selection.Ratings) }}>Avaliações</p>
        </div>
    )
}