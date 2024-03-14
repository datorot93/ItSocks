import React, { useRef, useState } from 'react'

// Images
import left_arrow from '../../../public/assets/homepage/slider/left_arrow.svg';
import right_arrow from '../../../public/assets/homepage/slider/right_arrow.svg';

import styles from '../../ui/styles/ScrollHorizontal.module.css';
import { useLocation } from 'react-router-dom';
import Slider from 'react-slick';

export const ScrollPersonalizadas = ({images}) => {

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
    // className: "center",
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 3000,
    arrows: true,
    slidesToShow: 3,
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

  // ANTERIOR
  // const location = useLocation().pathname

  // console.log(location.split('/').length)
  // const scrollContainerRef = useRef(null);
  // const [scrollLeft, setScrollLeft] = useState(0);
  
  // const handleScroll = (direction) => {    
  //   const container = scrollContainerRef.current;    

  //   if (container) {
  //     const scrollAmount = 300;
  //     const newScrollLeft =
  //       direction === 'left'
  //         ? scrollLeft - scrollAmount
  //         : scrollLeft + scrollAmount;

  //     container.scrollTo({
  //       left: newScrollLeft,
  //       behavior: 'smooth',
  //     });

  //     setScrollLeft(newScrollLeft);
  //   }
  // };


  return (

    <Slider {...settings}>
      {
        images.map( image => (
          <div key={image.id} onMouseOver={ mouseOver } onMouseLeave={ mouseLeave }>
            <img src={ image.src } alt={ image.descruption }/>
          </div>
        ))
      }
    </Slider>

    // <section className={ styles.main }>
    //     <div className={ styles.container }>

    //       <div 
    //         className={ `${styles.arrow_container} ${styles.left}` }
    //         onClick={() => handleScroll('left')}
    //       >
    //         <img src={ left_arrow } alt="left arrow" />
    //       </div>

    //         <div className={ styles.image_scroll} ref={scrollContainerRef}>
    //             {
    //                 images.map( image => (
    //                     <img src={ image.src } alt={ image.descruption } key={ image.id }/>
    //                 ))
    //             }
    //         </div>

    //         <div 
    //           className={ `${styles.arrow_container} ${styles.right}` }
    //           onClick={() => handleScroll('right')}
    //         >
    //           <img src={ right_arrow } alt="right arrow" />
    //       </div>

    //     </div>
    // </section>
  )
}