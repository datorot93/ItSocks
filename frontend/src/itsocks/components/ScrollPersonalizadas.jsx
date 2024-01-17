import React, { useRef, useState } from 'react'

// Images
import left_arrow from '../../../public/assets/homepage/slider/left_arrow.svg';
import right_arrow from '../../../public/assets/homepage/slider/right_arrow.svg';

import styles from '../../ui/styles/ScrollHorizontal.module.css';
import { useLocation } from 'react-router-dom';

export const ScrollPersonalizadas = ({images}) => {

  const location = useLocation().pathname

  console.log(location.split('/').length)
  const scrollContainerRef = useRef(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  const handleScroll = (direction) => {    
    const container = scrollContainerRef.current;    

    if (container) {
      const scrollAmount = 300;
      const newScrollLeft =
        direction === 'left'
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;

      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });

      setScrollLeft(newScrollLeft);
    }
  };


  return (
    <section className={ styles.main }>
        <div className={ styles.container }>

          <div 
            className={ `${styles.arrow_container} ${styles.left}` }
            onClick={() => handleScroll('left')}
          >
            <img src={ left_arrow } alt="left arrow" />
          </div>

            <div className={ styles.image_scroll} ref={scrollContainerRef}>
                {
                    images.map( image => (
                        <img src={ image.src } alt={ image.descruption } key={ image.id }/>
                    ))
                }
            </div>

            <div 
              className={ `${styles.arrow_container} ${styles.right}` }
              onClick={() => handleScroll('right')}
            >
              <img src={ right_arrow } alt="right arrow" />
          </div>

        </div>
    </section>
  )
}