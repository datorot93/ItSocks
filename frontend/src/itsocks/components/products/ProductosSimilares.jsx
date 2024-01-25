import React, { useEffect, useState } from 'react'

// ESTILOS
import styles from "../../../ui/styles/OpinionCliente.module.css";

// REACT SLICK
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// IMAGENES
import left_arrow from "../../../../public/assets/homepage/slider/left_arrow.svg";
import right_arrow from "../../../../public/assets/homepage/slider/right_arrow.svg";

// REACT ROUTER DOM
import { useLocation } from 'react-router-dom';
import { getProductsByDesign } from '../../helpers/getProductsByCategory';
import OpinionCliente from '../OpinionCliente';
import ScrollHorizontal from '../ScrollHorizontal';
// import { ProductoCard } from '../ProductoCard';
// import { LazyLoadImage } from 'react-lazy-load-image-component';




export const ProductosSimilares = ({design, product}) => {

  const location = useLocation().pathname
  const [ simirlarProducts, setSimirlarProducts] = useState([])

  useEffect(() => {
    getProductsByDesign(design).then(
      res => setSimirlarProducts([...res])
    ).catch( err => console.log(err))

  },[])

  console.log('ESTOS SON LOS PRODUCTOS SIMILARES')
  console.log(simirlarProducts)
  
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

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    arrows: true,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
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
    // <OpinionCliente/>
    // <section className={styles.main}>
      <div className={ styles.container}>
        {/* <Slider {...settings}>
              {simirlarProducts.map((product, index) => (
                <div className={styles.img_container} key={index} onMouseOver={ mouseOver } onMouseLeave={ mouseLeave }>
                  <div className={styles.img_center}>
                    <img src={product.images.image1} alt={product.name} />
                  </div>
                  <div >

                    <p>{product.price}</p>
                  </div>
                </div>
              ))}
        </Slider> */}
        <ScrollHorizontal
          masVendidos={simirlarProducts}
        />
      </div>
  );
}
