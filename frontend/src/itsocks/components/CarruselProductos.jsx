import styles from "../../ui/styles/CarruselProductos.module.css";

import { useEffect, useState } from "react";

// IMAGES
import left_arrow from "../../../public/assets/homepage/slider/left_arrow.svg";
import right_arrow from "../../../public/assets/homepage/slider/right_arrow.svg";

// Utilidades
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'animate.css';
import { getSliders } from "../helpers/getSliders";

export const CarruselProductos = () => {


  const [images, setImages] = useState([]);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [ isSelected, setIsSelected ] = useState(false)

  useEffect(() => {
    getSliders().then((res) => {
      setImages(res);
      setSelectedImage(res[0]);
      setSelectedIndex(0);
      
    }).catch((error) => {
      console.error('Error fetching sliders:', error);
    });
  }, []);

  const showImage = ( index ) => {
      if (index === 'avanzar') {        
        const newIndex = (selectedIndex + 1) % images.length;        
        setSelectedImage(images[newIndex]);
        setSelectedIndex(newIndex);
      } else if (index === 'retroceder' && selectedIndex > 0) {
        const newIndex = (selectedIndex - 1);
        setSelectedImage(images[newIndex]);
        setSelectedIndex(newIndex);
      } else if (typeof index === 'number') {
        const newIndex = index;
        setSelectedImage(images[newIndex]);
        setSelectedIndex(newIndex);
      }else if (index === 'retroceder' && selectedIndex === 0){
        setSelectedImage(images[images.length - 1]);
        setSelectedIndex(images.length - 1);
      }
  }

  useEffect(() => {
    const interval = setInterval(() => showImage('avanzar'), 3000);
    setIsSelected(true)

    return () => {
      clearInterval(interval);
      setIsSelected(false)
    };
  }, [selectedIndex]);

  const [arrowsVisible, setArrowsVisible] = useState(false);

  const mouseOver = () => {
    setArrowsVisible(true)
  }

  const mouseLeave = () => {
    setArrowsVisible(false)
  }

  return (
    <section className={styles.container} onMouseOver={ mouseOver } onMouseLeave={ mouseLeave }>
      <div className={`${ styles.slider_wrapper } animate__fadeInLeft`}>
        <div className={ `${styles.arrow_buttons} ${ styles.left_arrow} ${ arrowsVisible ? styles.arrow_visible : ''}`} >
          <img 
            src={ left_arrow } 
            alt="left arrow" 
            className={styles.left_arrow} 
            onClick={ () => showImage( 'retroceder' ) }
          />
        </div>
        <div className={ `${styles.arrow_buttons} ${ styles.right_arrow } ${ arrowsVisible ? styles.arrow_visible : ''}`} >
          <img 
            src={ right_arrow } 
            alt="left arrow" 
            className={styles.right_arrow}
            onClick={ () => showImage('avanzar') }
          />
        </div>
        {
          selectedImage ?
            <LazyLoadImage
              src={selectedImage.url || ''}
              alt={selectedImage.alt || ''}
              className={`${styles.img_carrusel} ${
                loaded ? "loaded" : "not_loaded"
              }`}
              onLoad={() => setLoaded(true)}
            />: <></>
        }
        
        <div className={styles.slider_nav}>
          {images.map((image, index) => (
            <button 
              onClick={ () => showImage( index ) } 
              key={image.id}
              className={
                `${styles.slider_nav_button} 
                ${ selectedIndex === index ? styles.selected_nav_button : ""}`
              }
            >
            </button>
          ))}
          
        </div>
      </div>
    </section>
  );
};