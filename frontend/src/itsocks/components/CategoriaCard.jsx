import React, { useState } from 'react';

// React Router Dom
import { Link } from 'react-router-dom';



import styles from '../../ui/styles/Medias.module.css';

export const CategoriaCard = ({
    id,
    nombre,
    estado,
    categoria,
    image
}) => {


  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const labels = {
    'MEDIA CANIA': 'MEDIA CAÑA',
    'ESTAMPADAS': 'ESTAMPADAS',
    'TEJIDAS': 'TEJIDAS',
    'LARGAS': 'LARGAS',
    'LARGA': 'LARGAS',
    'PANTORRILLERA': 'PANTORRILLERAS',
    'PERSONALIZADAS': 'PERSONALIZADAS',
  }

  console.log()
  return (
    
    <div className={ `${styles.imageContainer}` }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      
      <Link to={ nombre } >
        <img src={ image } alt= { nombre } />        
        <div className={`${ styles.blur_div} ${isHovered ? styles.hovered : ""}`}>
          <div className={styles.hoverText}>
              <p>{ labels[nombre.toUpperCase().replace('_', ' ')] }</p>
              {/* <p>{ nombre.toUpperCase().replace('_', ' ') }</p> */}
          </div>
        </div>
      </Link>

      

      {/* <div className={`${styles.blur_div} ${isHovered ? styles.hovered : ""}`} `}>
          <div className={styles.hoverText}>
              <p>{ nombre }</p>
          </div>
        </div> */}
      {/* {isHovered && (
        
      )} */}
    </div>
    
  )
}