import React, { useEffect, useState } from "react";

// Styles
import styles from "../../ui/styles/HomePage.module.css";

// Images
import popup_promo_c from "../../../public/assets/homepage/popup_promo_c.jpg.webp";

import { CarruselProductos } from "../components/CarruselProductos";
import { LazyLoadImage } from "react-lazy-load-image-component";
import OpinionCliente from "../components/OpinionCliente";
import { Link, useLocation } from "react-router-dom";
import VideoComponent from "../components/VideoComponent";
import ScrollHorizontal from "../components/ScrollHorizontal";
import { PopUpPromo } from "../components/PopUpPromo";
import { getLifeStyles } from "../helpers/getSliders";


const quitarAcentos = (cadena) => {
  return cadena.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "_").toLowerCase();
}


export const ItSocks = () => {
  
  const [showPopup, setShowPopup] = useState(false);
  const [ lifeStyles, setLifeStyles ] = useState([]);

  useEffect(() => {
    const hasPopupBeenShown = sessionStorage.getItem('popupShown');
    if (!hasPopupBeenShown) {
      setShowPopup(true);
      sessionStorage.setItem('popupShown', 'true');
    }
    window.scrollTo(0, 0);

    getLifeStyles().then( (data) => {
      setLifeStyles(data);
    })
  }, []);


  // const estilosVida = [
  //   {
  //     id: "p1",
  //     src: "../../../public/assets/homepage/estilos_vida/p1.png",
  //     description: "RUNNING",
  //   },
  //   {
  //     id: "p2",
  //     src: "../../../public/assets/homepage/estilos_vida/p2.png",
  //     description: "CICLISMO",
  //   },
  //   {
  //     id: "p3",
  //     src: "../../../public/assets/homepage/estilos_vida/p3.png",
  //     description: "TRABAJO",
  //   },
  //   {
  //     id: "p4",
  //     src: "../../../public/assets/homepage/estilos_vida/p4.jpg",
  //     description: "DÍA A DÍA",
  //   },
  //   {
  //     id: "p5",
  //     src: "../../../public/assets/homepage/estilos_vida/p5.png",
  //     description: "FITNESS",
  //   },
  // ];

  // const beneficiosImage = [
  //   {
  //     id: "b2",
  //     src: "../../../public/assets/homepage/beneficios/b2.mp4",
  //     description: "Video beneficios",
  //   },
  // ];


  
  return (
    <section className={styles.main}>
      {
        showPopup && (
          <PopUpPromo setShowPopup = {setShowPopup}/>
        )
      }
      <div className={styles.container}>
        <CarruselProductos />
        <div className={styles.mas_vendidos}>
          <h2>LOS PRODUCTOS MÁS VENDIDOS</h2>
          <ScrollHorizontal></ScrollHorizontal>
        </div>

        <div className={styles.estilos_vida}>
          <h2>ESTILOS DE VIDA</h2>
          <div className={styles.image_container}>
            {lifeStyles.map((image, index) => (
              <Link key={index} to={quitarAcentos(image.name)}>
                <div className={styles.estilos_card} key={index}>
                  <LazyLoadImage
                    src={image.image_url}
                    alt={image.name}
                    key={index}
                  />
                  <p>{image.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.beneficios_container_exterior}>
        <VideoComponent></VideoComponent>
        </div>


          <div className={ styles.opinion_cliente}>
            <h2 className={styles.clientes_titulo}>QUÉ PIENSAN NUESTROS CLIENTES</h2>
            <OpinionCliente/>  
          </div>
      </div>
    </section>
  );
};