import React, { Component } from 'react'
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import styles from '../../ui/styles/ScrollHorizontal.module.css';

function ScrollHorizontal() {

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
      src: "../../../public/assets/medias/productos/p5.png",
      description: "Esta es una media",
    },
  ];

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "red", paddingLeft: 20}}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "green" }}
        onClick={onClick}
      />
    );
  }
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    arrows: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <Slider {...settings}>
      {masVendidos.map((image) => (
        <div className={styles.img_container}>
          <div className={styles.img_center}>
            <img src={image.src} alt={image.descruption} key={image.id} />
          </div>
        </div>
      ))}
    </Slider>

  );
}

export default ScrollHorizontal;
