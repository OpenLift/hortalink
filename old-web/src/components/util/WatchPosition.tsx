import geoLocation from "../../util/geoLocation";
import { useEffect } from "react";

export default function WatchPosition() {
    useEffect(() => {
        geoLocation.watchPosition()
    }, [])
    
    return <></>
}