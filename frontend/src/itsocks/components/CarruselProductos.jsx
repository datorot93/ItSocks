import styles from "../../ui/styles/CarruselProductos.module.css";

import slider_1 from "../../../public/assets/homepage/slider/slider_1.jpg";
import slider_2 from "../../../public/assets/homepage/slider/slider_2.jpg";

import { useState } from "react";

// Utilidades
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'animate.css';

export const CarruselProductos = ({images}) => {
  

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [loaded, setLoaded] = useState(false);
  const [ isSelected, setIsSelected ] = useState(false)

  const showImage = ( index ) => {
    setTimeout(() => {
      setSelectedImage(images[index]);
      setSelectedIndex(index);
    }, 500);
  }

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
