import React, { useId } from 'react'

// Styles
import styles from '../../ui/styles/HomePage.module.css';

import { Slider2 } from '../components/Slider2';
import { CarruselProductos } from '../components/CarruselProductos';
import { ScrollHorizontal } from '../components/ScrollHorizontal';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { OpinionCliente } from '../components/OpinionCliente';
import { Link } from 'react-router-dom';



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
  
  const beneficiosImage = [
    {
      id: "b2",
      src: "../../../public/assets/homepage/beneficios/b2.mp4",
      description: "Video beneficios"
    }
  ];

  const opinionesClienes = [
    {
        id: "c1",
        src: "../../../public/assets/homepage/opiniones/c1.png",
        opinion: "Sorem ipsum dolor sit amet, consectetur adipiscing elit.",
        description: "Esta es una imagen del cliente",
    },
    {
        id: "c2",
        src: "../../../public/assets/homepage/opiniones/c2.png",
        opinion: "Sorem ipsum dolor sit amet, consectetur adipiscing elit.",
        description: "Esta es una imagen del cliente",
    },
    {
        id: "c3",
        src: "../../../public/assets/homepage/opiniones/c3.png",
        opinion: "Sorem ipsum dolor sit amet, consectetur adipiscing elit.",
        description: "Esta es una imagen del cliente",
    },
    {
        id: "c4",
        src: "../../../public/assets/homepage/opiniones/c4.png",
        opinion: "Sorem ipsum dolor sit amet, consectetur adipiscing elit.",
        description: "Esta es una imagen del cliente",
    },
    {
      id: "c5",
      src: "../../../public/assets/homepage/opiniones/c4.png",
      opinion: "Sorem ipsum dolor sit amet, consectetur adipiscing elit.",
      description: "Esta es una imagen del cliente",
  },
  {
    id: "c6",
    src: "../../../public/assets/homepage/opiniones/c4.png",
    opinion: "Sorem ipsum dolor sit amet, consectetur adipiscing elit.",
    description: "Esta es una imagen del cliente",
}
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
          <h2>ESTILOS DE VIDA</h2>
          <div className={ styles.image_container }>
            {estilosVida.map( (image, index) => (
              <Link key={ index } to={ image.description.toLowerCase() }>
                <div className={ styles.estilos_card } key={ index }>
                  <LazyLoadImage src={ image.src } alt={ image.description } key={ index }/>
                  <p>{ image.description }</p>
                </div>
              </Link>
            ))}
          </div>

          
        </div>

        <div className={ styles.beneficios_container }>
          <h2>BENEFICIOS DE NUESTRAS MEDIAS</h2>
          <div className={ styles.beneficios_image_container }>
            {
              beneficiosImage.map( (image, index) => (                
                <video width={750}  height={850} controls key={index}>
                  <source src={ image.src } type="video/mp4" />
                </video>
              ))
            }
          </div>
        </div>

        <div className={ styles.opiniones_container }>
          <h2>LO QUÉ PIENSASN NUESTROS CLIENTES</h2>

          <div className={ styles.opiniones_clientes }>
            {
              opinionesClienes.map( (cliente, index) => (
                <OpinionCliente key={ index } cliente={ cliente }/>
              ))
            }
          </div>
        </div>
      </div>
    </section>
  )
}
