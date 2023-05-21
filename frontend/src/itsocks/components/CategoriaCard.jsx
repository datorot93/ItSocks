import React from 'react';

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
  
  return (
    
    <div className={ styles.card }>
      <Link to={ nombre }>
        <img src={ image } alt= { nombre } />
      </Link>
    </div>
    
  )
}