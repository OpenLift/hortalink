import { useState } from "react";
import type { WritableAtom } from "nanostores";

export default function useStoreAsReactState<T>(store: WritableAtom<T>): [T, React.Dispatch<React.SetStateAction<T>>, () => void] {
    const currentValue = store.get()
    
    const [getter, setter] = useState<T>(currentValue)

    const destroy_listener = store.listen((value) => {
        setter(value)
    })

    return [getter, setter, destroy_listener]
}