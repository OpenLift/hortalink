import React from "react";
import Geolocation from "../stores/Geolocation";
import {GPS_state} from "../stores/Geolocation";

class NotAvailableError extends Error {
    constructor(msg: string) {
        super(msg);

        Object.setPrototypeOf(this, NotAvailableError.prototype);
    }

}

function watchPosition() {
    if ("geolocation" in navigator) {
        const WatchId = navigator.geolocation.watchPosition((position) => {
            let current_location = Geolocation.position.get();

            if (!current_location && JSON.stringify(current_location) ===
                JSON.stringify([position.coords.latitude, position.coords.longitude])) {
                return
            }

            console.log("Aviso: localização do dispositivo atualizada")

            Geolocation.position.set([position.coords.latitude, position.coords.longitude])
            Geolocation.state.set(GPS_state.updated)

        }, (error) => {
            if (error.code === error.PERMISSION_DENIED) {
                Geolocation.state.set(GPS_state.denied)
            }
        }, {
            enableHighAccuracy: true
        })

        return WatchId
    } else {
        Geolocation.state.set(GPS_state.not_available)
    }
}

export default {
    watchPosition
}