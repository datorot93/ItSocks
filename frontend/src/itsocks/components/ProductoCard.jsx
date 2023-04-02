import React from 'react';


import styles from '../../ui/styles/Accesorios.module.css';

export const ProductoCard = ({
  id,
  nombre,
  estado,
  precio,
  categoria,
  subcategoria,
  id_referencia_fabrica,
  id_diseño,
  image
}) => {

  return (
    
    <div className={ styles.card }>
      
      <img src={ 	`./assets/accesorios/${ nombre }.jpg` } alt= { nombre } />
      
    </div>
    
  )
}
