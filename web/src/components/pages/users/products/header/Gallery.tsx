import { useState } from "react";
import GalleryChangeLoading from "./GalleryChangeLoading";
import { useEffect } from "react";

export default function Gallery(props: { photos: string[], product_id: number}) {
    const photos = props.photos
    const [imageIndex, setImageIndex] = useState<number>(0)

    const [firstLoad, setLoaded] = useState<boolean>(false)
    const [isLoading, setisLoading] = useState<boolean>(false)

    useEffect(() => {
        if(!firstLoad) {
            return;
        }
        setisLoading(true)
    }, [imageIndex])

    return (
        <>
            <section className="gallery" style={{ minHeight: firstLoad ? 0 : `388px`, minWidth: firstLoad ? 0 : `500px` }}>
                <img
                    src={`${import.meta.env.PUBLIC_FRONTEND_CDN_URL}/products/${props.product_id}/${photos[imageIndex].replace("/", "⁄")}.jpg?size=1024`}
                    alt="Foto do produto"
                    onLoad={() => {
                        if(!firstLoad) {
                            setLoaded(true)
                        }

                        if(isLoading) {
                            setisLoading(false)
                        }
                    }}
                />
                {
                    isLoading && <GalleryChangeLoading />
                }
                <div className="arrows">
                    <img className="arrow left" src={"/assets/arrow.svg"} onClick={() => setImageIndex(imageIndex >= 1 ? imageIndex - 1 : imageIndex)}/>
                    <img className="arrow right" hidden={imageIndex >= photos.length - 1} src={"/assets/arrow.svg"} onClick={(() => setImageIndex(imageIndex <= photos.length - 1 ? imageIndex + 1: imageIndex))} />    
                </div>
            </section>
            <div className="bg">
                <img src={`/cdn/products/${props.product_id}/${photos[imageIndex]}.jpg?size=1024`} />
            </div>
        </>
    )
}