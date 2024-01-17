import React from "react";

// Styles
import styles from "../../ui/styles/HomePage.module.css";

import { CarruselProductos } from "../components/CarruselProductos";
import { LazyLoadImage } from "react-lazy-load-image-component";
import OpinionCliente from "../components/OpinionCliente";
import { Link } from "react-router-dom";
import VideoComponent from "../components/VideoComponent";
import ScrollHorizontal from "../components/ScrollHorizontal";


const quitarAcentos = (cadena) => {
  return cadena.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "_").toLowerCase();
}


export const ItSocks = () => {

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
      description: "DÍA A DÍA",
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
      description: "Video beneficios",
    },
  ];


  return (
    <section className={styles.main}>
      <div className={styles.container}>
        <CarruselProductos />
        <div className={styles.mas_vendidos}>
          <h2>LOS PRODUCTOS MÁS VENDIDOS</h2>
          <ScrollHorizontal></ScrollHorizontal>
        </div>

        <div className={styles.estilos_vida}>
          <h2>ESTILOS DE VIDA</h2>
          <div className={styles.image_container}>
            {estilosVida.map((image, index) => (
              <Link key={index} to={quitarAcentos(image.description)}>
                <div className={styles.estilos_card} key={index}>
                  <LazyLoadImage
                    src={image.src}
                    alt={image.description}
                    key={index}
                  />
                  <p>{image.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.beneficios_container}>
        <VideoComponent></VideoComponent>
        </div>

        <div>
          <div>
            <h2 className={styles.clientes_titulo}>LO QUÉ PIENSAN NUESTROS CLIENTES</h2>
            <div>   
                <OpinionCliente/>  
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
