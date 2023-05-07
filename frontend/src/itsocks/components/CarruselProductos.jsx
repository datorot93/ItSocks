
import styles from '../../ui/styles/CarruselProductos.module.css';

import slider_1 from '../../../public/assets/homepage/slider/slider_1.jpg';
import slider_2 from '../../../public/assets/homepage/slider/slider_2.jpg';

import { useState } from 'react';
import { LazyLoadImage } from "react-lazy-load-image-component";

export const CarruselProductos = (props) => {
  
  // const images = [slider_1, slider_2];

  const images = [
    {
      id: "slider1",
      src: "../../../public/assets/homepage/slider/slider_1.jpg"
    },
    {
      id: "slider2",
      src: "../../../public/assets/homepage/slider/slider_2.jpg"
    }
  ];

  const [ selectedIndex, setSelectedIndex ] = useState(0);
  const [ selectedImage, setSelectedImage ] = useState(images[0]);
  const [ loaded, setLoaded ] = useState(false)

  const selectNewImage = ( index, images, next=true ) => {
    setLoaded(false);
    const condition = next ? selectedIndex < images.length - 1: selectedIndex > 0;
    const nextIndex = next ? 
      (condition ? selectedIndex + 1: 0) : 
      (condition ? selectedIndex - 1: images.length - 1)

    setSelectedImage(images[nextIndex]);
    setSelectedIndex(nextIndex);
  };

  const previous = () => {
    selectNewImage( selectedIndex, images, false );
  };

  const next = () => {
    selectNewImage( selectedIndex, images );
  };

  

  return (
    <div>
      <LazyLoadImage 
        src={ selectedImage.src } 
        alt="Image of slider"
        className={ loaded ? "loaded" : ""}
        onLoad={ () => setLoaded(true) }
      />
      <button onClick={ previous }>{"<"}</button>
      <button onClick={ next }>{">"}</button>
    </div>
  );
}
