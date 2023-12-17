import styles from "../../ui/styles/CarruselProductos.module.css";

import { useEffect, useState } from "react";

// Utilidades
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'animate.css';

export const CarruselProductos = ({images}) => {
  

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [loaded, setLoaded] = useState(false);
  const [ isSelected, setIsSelected ] = useState(false)

  const showImage = (  ) => {
    // setTimeout(() => {
      const newIndex = (selectedIndex + 1) % images.length;
      setSelectedImage(images[newIndex]);
      setSelectedIndex(newIndex);
    // }, 2000);
  }

  useEffect(() => {
    // Configurar un intervalo para cambiar de imagen cada 2 segundos
    const interval = setInterval(showImage, 3000);

    // Limpieza del intervalo cuando el componente se desmonta
    return () => {
      clearInterval(interval);
    };
  }, [selectedIndex]);

  return (
    <div className={styles.container}>
      <div className={`${ styles.slider_wrapper } animate__fadeInLeft`}>
        <LazyLoadImage
          src={selectedImage.src}
          alt="Image of slider"
          className={`${styles.img_carrusel} ${
            loaded ? "loaded" : "not_loaded"
          }`}
          onLoad={() => setLoaded(true)}
        />
        <div className={styles.slider_nav}>
          {images.map((image, index) => (
            <button onClick={ () => showImage( index )} key={image.id}></button>
          ))}
        </div>
      </div>
    </div>
  );
};