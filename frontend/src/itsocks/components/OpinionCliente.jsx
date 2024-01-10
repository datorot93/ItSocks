import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Slider from "react-slick";
import styles from "../../ui/styles/OpinionCliente.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaStar } from "react-icons/fa";

function OpinionCliente() {
  // Estilos
  const opinionesClientes = [
    {
      id: "c1",
      src: "../../../public/assets/homepage/opiniones/c1.png",
      opinion: "Sorem ipsum dolor sit amet, consectetur adipiscing elit.",
      description: "Esta es una imagen del cliente",
      calificacion: 5
    },
    {
      id: "c2",
      src: "../../../public/assets/homepage/opiniones/c2.png",
      opinion: "Sorem ipsum dolor sit amet, consectetur adipiscing elit.",
      description: "Esta es una imagen del cliente",
      calificacion: 4
    },
    {
      id: "c3",
      src: "../../../public/assets/homepage/opiniones/c3.png",
      opinion: "Sorem ipsum dolor sit amet, consectetur adipiscing elit.",
      description: "Esta es una imagen del cliente",
      calificacion: 5
    },
    {
      id: "c4",
      src: "../../../public/assets/homepage/opiniones/c4.png",
      opinion: "Sorem ipsum dolor sit amet, consectetur adipiscing elit.",
      description: "Esta es una imagen del cliente",
      calificacion: 5
    },
    {
      id: "c5",
      src: "../../../public/assets/homepage/opiniones/c4.png",
      opinion: "Sorem ipsum dolor sit amet, consectetur adipiscing elit.",
      description: "Esta es una imagen del cliente",
      calificacion: 5
    },
    {
      id: "c6",
      src: "../../../public/assets/homepage/opiniones/c4.png",
      opinion: "Sorem ipsum dolor sit amet, consectetur adipiscing elit.",
      description: "Esta es una imagen del cliente",
      calificacion: 5
    },
  ];

  var settings = {
    className: "center",
    infinite: true,
    arrows: false,
    centerPadding: "60px",
    slidesToShow: 4,
    swipeToSlide: true,
    afterChange: function (index) {
      console.log(
        `Slider Changed to: ${index + 1}, background: #222; color: #bada55`
      );
    },
  };

  const renderStars = () => {
    const MAX_STARS = 5;
    const filledStars = parseInt(opinionesClientes.calificacion) || 0;

    return Array.from({ length: MAX_STARS }, (_, index) => (
      <FaStar
        key={index}
        color={index < filledStars ? '#e4e5e9' : '#e4e5e9'}
      />
    ));
  };

  return (
    <Slider {...settings}>
      {opinionesClientes.map((cliente, index) => (
        <div className={styles.img_container} key={index}>
          <div className={styles.img_center}>
            <LazyLoadImage src={cliente.src} alt={cliente.descripcion} />
          </div>
          <p>"{cliente.opinion}"</p>
          <div className={styles.info_opiniones}>
            <p>-Lorem ipsum</p>
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
