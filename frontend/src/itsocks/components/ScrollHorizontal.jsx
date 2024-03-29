import React, { Component, useState } from "react";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faCircleChevronLeft,
  faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";

// IMAGES\
import left_arrow from "../../../public/assets/homepage/slider/left_arrow.svg";
import right_arrow from "../../../public/assets/homepage/slider/right_arrow.svg";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import styles from "../../ui/styles/ScrollHorizontal.module.css";
import { Link } from "react-router-dom";

function ScrollHorizontal({masVendidos}) {

  const [arrowsVisible, setArrowsVisible] = useState(false);
  const mouseOver = () => {
    setArrowsVisible(true)
  }

  const mouseLeave = () => {
    setArrowsVisible(false)
  }
  if(!masVendidos){
    masVendidos = [
      {
        id: "p1",
        images: {
          image1: "../../../public/assets/medias/productos/p1.png"
        },
        name: "Esta es una media",
        price: "10000",
      },
      {
        id: "p2",
        images: {
          image1: "../../../public/assets/medias/productos/p2.png"
        },
        name: "Esta es una media",
        price: "10000",
      },
      {
        id: "p3",
        images: {
          image1: "../../../public/assets/medias/productos/p3.png"
        },
        name: "Esta es una media",
        price: "10000",
      },
      {
        id: "p4",
        images: {
          image1: "../../../public/assets/medias/productos/p5.png"
        },
        name: "Esta es una media",
        price: "10000",
      },
      {
        id: "p5",
        images: {
          image1: "../../../public/assets/medias/productos/p3.png"
        },
        name: "Esta es una media",
        price: "10000",
      },
      {
        id: "p6",
        images: {
          image1: "../../../public/assets/medias/productos/p5.png"
        },
        name: "Esta es una media",
        price: "10000",
      }
    ];
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
  var settings = {
    // className: "center",
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 80000,
    arrows: true,
    slidesToShow: 4,
    slidesToScroll: 2,
    initialSlide: 0,
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
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  // console.log(masVendidos)
  return (
    <Slider {...settings}>
      {masVendidos.map((image, index) => (
        <div 
          className={styles.img_container} 
          key={index} 
          onMouseOver={ mouseOver } 
          onMouseLeave={ mouseLeave }
        >
          <Link to={`/productos/${image.name.toLowerCase()}`}>

            <div className={styles.product}>
              <div className={styles.img_center}>
                <img src={image.images.image1} alt="" key={image.id} />
              </div>
              <div className={styles.container_price}>
                <p className={styles.description_image}>{image.name}</p>
                <p className={styles.price_image}>{image.price}</p>
              </div>
            </div>
          </Link>
          
        </div>
      ))}
    </Slider>
  );
}

export default ScrollHorizontal;
