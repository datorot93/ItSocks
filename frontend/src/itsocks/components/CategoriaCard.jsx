import React, { useState } from 'react';

// React Router Dom
import { Link } from 'react-router-dom';



import styles from '../../ui/styles/Medias.module.css';

export const CategoriaCard = ({
    name,
    image_url,

}) => {

  
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    
    <div className={ `${styles.imageContainer}` }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      
      <Link to={ name.replace('%20', '_').replace(' ', '_').replace('caña', 'cania') } >
        <img src={ image_url } alt= { name } />        
        <div className={`${ styles.blur_div} ${isHovered ? styles.hovered : ""}`}>
          <div className={styles.hoverText}>
              {/* <p>{ labels[name.toUpperCase().replace('_', ' ')] }</p> */}
              <p>{ name.toUpperCase().replace('_', ' ') }</p>
          </div>
        </div>
      </Link>
    </div>
    
  )
}