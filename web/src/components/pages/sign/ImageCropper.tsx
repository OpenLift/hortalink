import Cropper from "cropperjs";
import { useEffect, useRef } from "react";

import Sign from "@stores/pages/Sign";
import { useStore } from "@nanostores/react";

export default function ImageCropper() {
    const isOpen = useStore(Sign.SignUpCropperOpen)

    const modalRef = useRef<HTMLDivElement>()
    const imgPreviewRef = useRef<HTMLImageElement>()

    const confirmRef = useRef<HTMLButtonElement>()
    const cancelRef = useRef<HTMLButtonElement>()

    useEffect(() => {
        function init() {
            const original_profile_img = document.querySelector<HTMLImageElement>("#user_profile_img")
        
            imgPreviewRef.current.src = original_profile_img.src
            imgPreviewRef.current.style.display = "none"
    
            const cropper = new Cropper(imgPreviewRef.current, {
                viewMode: 3,
                minContainerHeight: 600
            })
    
            confirmRef.current.addEventListener("click", () => {
                const cropped_img = cropper.getCroppedCanvas().toDataURL()
                original_profile_img.src = cropped_img
                Sign.SignUpCropperOpen.set(false)
            })
    
            cancelRef.current.addEventListener("click", () => {
                Sign.SignUpCropperOpen.set(false)
                cropper.destroy()
                
            })
        }

        if(isOpen) {
            init()
        }
    }) // sem dependência nenhuma, para o código rodar sempre que o componente for re-renderizado pelo isOpen.

    if(isOpen) {
        return (
            <section className="cropper_modal" ref={modalRef}>
                <div className="cropper_container">
                    <h2>Cortar imagem</h2>
    
                    <img
                        alt="Prévia da foto do usuário"
                        width={137}
                        height={137}

                        style={{ display: "block", maxWidth: "100%" }}
    
                        ref={imgPreviewRef}
                    />

                    <div className="buttons">
                        <button className="confirm" ref={confirmRef}>
                            Confirmar
                        </button>
                        <button className="cancel" ref={cancelRef}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </section>
        )
    } else {
        return <></>
    } //re-renders every change
}