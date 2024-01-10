import React, { Component } from "react";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faCircleChevronLeft,
  faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import styles from "../../ui/styles/ScrollHorizontal.module.css";

function ScrollHorizontal() {
  const masVendidos = [
    {
      id: "p1",
      src: "../../../public/assets/medias/productos/p1.png",
      description: "Esta es una media",
      price: "10000",
    },
    {
      id: "p2",
      src: "../../../public/assets/medias/productos/p2.png",
      description: "Esta es una media",
      price: "10000",
    },
    {
      id: "p3",
      src: "../../../public/assets/medias/productos/p3.png",
      description: "Esta es una media",
      price: "10000",
    },
    {
      id: "p4",
      src: "../../../public/assets/medias/productos/p5.png",
      description: "Esta es una media",
      price: "10000",
    },
  ];

  const CustomNextArrow = (props) => (
    <div className={styles.custom_next_arrow} onClick={props.onClick}>
      <FontAwesomeIcon icon={faCircleChevronRight} style={{ color: "black" }} />
    </div>
  );

  const CustomPrevArrow = (props) => (
    <div className={styles.custom_prev_arrow} onClick={props.onClick}>
      <FontAwesomeIcon icon={faCircleChevronLeft} style={{ color: "black" }} />
    </div>
  );
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    arrows: true,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <Slider {...settings}>
      {masVendidos.map((image, index) => (
        <div className={styles.img_container} key={index}>
          <div className={styles.escalable}>
            <div className={styles.img_center}>
              <img src={image.src} alt="" key={image.id} />
            </div>
          </div>
          <div>
            <p className={styles.description_image}>{image.description}</p>
            <p className={styles.price_image}>{image.price}</p>
          </div>
        </div>
      ))}
    </Slider>
  );
}

export default ScrollHorizontal;
