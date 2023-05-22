import React from 'react'

import styles from '../../ui/styles/HomePage.module.css';
import { Slider2 } from '../components/Slider2';
import { CarruselProductos } from '../components/CarruselProductos';
import { ScrollHorizontal } from '../components/ScrollHorizontal';
import { LazyLoadImage } from 'react-lazy-load-image-component';



export const ItSocks = () => {

  const images = [
    {
      id: "slider1",
      src: "../../../public/assets/homepage/slider/slider_1.jpg",
      description: "Esta es la primera imágen del slider",
    },
    {
      id: "slider2",
      src: "../../../public/assets/homepage/slider/slider_2.jpg",
      description: "Esta es la segunda imágen del slider",
    },
  ];

  const masVendidos = [
    {
      id: "p1",
      src: "../../../public/assets/medias/productos/p1.png",
      description: "Esta es una media",
    },
    {
      id: "p2",
      src: "../../../public/assets/medias/productos/p2.png",
      description: "Esta es una media",
    },
    {
      id: "p3",
      src: "../../../public/assets/medias/productos/p3.png",
      description: "Esta es una media",
    },
    {
      id: "p4",
      src: "../../../public/assets/medias/productos/p4.png",
      description: "Esta es una media",
    },
    {
      id: "p5",
      src: "../../../public/assets/medias/productos/p5.png",
      description: "Esta es una media",
    },
  ];

  const estilosVida = [
    {
      id: "p1",
      src: "../../../public/assets/homepage/estilos_vida/p1.png",
      description: "RUNNING",
    },
    {
      id: "p2",
      src: "../../../public/assets/homepage/estilos_vida/p2.png",
      description: "CICLISMO",
    },
    {
      id: "p3",
      src: "../../../public/assets/homepage/estilos_vida/p3.png",
      description: "TRABAJO",
    },
    {
      id: "p4",
      src: "../../../public/assets/homepage/estilos_vida/p4.png",
      description: "CASUAL",
    },
    {
      id: "p5",
      src: "../../../public/assets/homepage/estilos_vida/p5.png",
      description: "FITNESS",
    },
  ];
  
  return (
    <section className={ styles.main }>
      <div className={ styles.container }>
        <CarruselProductos images={ images }/>
        <div className={ styles.mas_vendidos}>
          <h2>LOS PRODUCTOS MÁS VENDIDOS</h2>
          <ScrollHorizontal images={ masVendidos } />
        </div>
        <div className={ styles.estilos_vida }>
          <h2>Estilos de vida</h2>
          <div className={ styles.image_container }>
            {estilosVida.map( image => (
              <LazyLoadImage src={ image.src } alt={ image.description } key={ image.id }/>
            ))}
          </div>

          
        </div>
        <h2>Beneficios de nuestras medias</h2>
        <p>Acá va el video</p>
        <h2>Que piensan nuestros clientes</h2>
        <p>Acá van imágenes circulares de los perfiles de los clientes con la descripción abajo de estas</p>
      </div>
    </section>
  )
}
