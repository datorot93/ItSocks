import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Slider from "react-slick";
import styles from "../../ui/styles/OpinionCliente.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaStar } from "react-icons/fa";

import left_arrow from "../../../public/assets/homepage/slider/left_arrow.svg";
import right_arrow from "../../../public/assets/homepage/slider/right_arrow.svg";

function OpinionCliente() {
  // Estilos
  const opinionesClientes = [
    {
      id: "c1",
      nombre_cliente: "Carolina López",
      src: "../../../public/assets/homepage/opiniones/c1.webp",
      opinion: "Espectaculares como siempre, nunca me han quemado así estén nuevas. Nunca salgo a entrenar sin sus medias, hago gym, bici y running sin problema.",
      description: "Esta es una imagen del cliente",
      calificacion: 5
    },
    {
      id: "c2",
      nombre_cliente: "Andrés Triana",
      src: "../../../public/assets/homepage/opiniones/c2.webp",
      opinion: "Unas medias muy cómodas y de gran ayuda para lograr mis objetivos personales. El objetivo se cumplio y las medias mantuvieron mis piernas en un gran estado.",
      description: "Esta es una imagen del cliente",
      calificacion: 4
    },
    {
      id: "c3",
      nombre_cliente: "Fernanda Buitrago",
      src: "../../../public/assets/homepage/opiniones/c3.webp",
      opinion: "Aquí andamos!!!Nuevamente! Gané un segundo puesto en una gran carrera y las medias fueron importantes porque en medio de un calor de 40 grados lo único que no me molestó fueron las piernitas .",
      description: "Esta es una imagen del cliente",
      calificacion: 5
    },
    {
      id: "c4",
      nombre_cliente: "Ana María Castillo",
      src: "../../../public/assets/homepage/opiniones/c4.webp",
      opinion: "Me encantaron las medias!!! Excelente calidad, y los diseños son geniales. Muchas gracias.",
      description: "Esta es una imagen del cliente",
      calificacion: 5
    },
    {
      id: "c5",
      nombre_cliente: "Leidy Muñoz",
      src: "../../../public/assets/homepage/opiniones/c5.webp",
      opinion: "Desde que compré el primer par de medias con It Socks quedé convencida de que son las mejores medias de compresión para running.",
      description: "Esta es una imagen del cliente",
      calificacion: 5
    },
    {
      id: "c6",
      nombre_cliente: "Nora Beltrán",
      src: "../../../public/assets/homepage/opiniones/c6.webp",
      opinion: "Correr es mi terapia... Me gocé esos 10k en la MMB, bajé tiempo y me encantaron las medias. Gracias, son geniales",
      description: "Esta es una imagen del cliente",
      calificacion: 5
    },
  ];

  const [arrowsVisible, setArrowsVisible] = useState(false);

  const mouseOver = () => {
    setArrowsVisible(true)
  }

  const mouseLeave = () => {
    setArrowsVisible(false)
  }

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div className={ `${styles.arrow_buttons} ${ styles.right_arrow } ${ arrowsVisible ? styles.arrow_visible : ''}`} >
          <img 
            src={ right_arrow } 
            alt="left arrow" 
            className={styles.left_arrow} 
            onClick={ onClick }
          />
        </div>
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div 
        className={ 
          `${styles.arrow_buttons} ${ styles.left_arrow} ${ arrowsVisible ? styles.arrow_visible : ''}`
        } 
      >
          <img 
            src={ left_arrow } 
            alt="left arrow" 
            className={styles.left_arrow} 
            onClick={ onClick }
          />
        </div>
    );
  }

  const settings = {
    className: "center",
    infinite: true,
    arrows: true,
    centerPadding: "60px",
    slidesToScroll: 1,
    autoplay: true,
    speed: 4000,
    autoplaySpeed: 4000,
    slidesToShow: 4,
    swipeToSlide: true,
    afterChange: function (index) {
      console.log(
        ``
      );
    },
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true
        }
      }
    ],
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

  const renderStars = () => {
    const MAX_STARS = 5;
    const filledStars = parseInt(opinionesClientes.calificacion) || 0;

    return Array.from({ length: MAX_STARS }, (_, index) => (
      <FaStar
        key={index}
        // color={index < filledStars ? '#e4e5e9' : '#e4e5e9'}
        color={'#FDC204'}
      />
    ));
  };

  return (
    <Slider {...settings}>
      {opinionesClientes.map((cliente, index) => (
        <div className={styles.img_container} key={index} onMouseOver={ mouseOver } onMouseLeave={ mouseLeave }>
          <div className={styles.img_center}>
            <LazyLoadImage src={cliente.src} alt={cliente.description} />
          </div>
          <p>"{cliente.opinion}"</p>
          <div className={styles.info_opiniones}>
            <p>-{cliente.nombre_cliente}</p>
            <div className={styles.calificacion}>
              {renderStars()}
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
}

export default OpinionCliente;
