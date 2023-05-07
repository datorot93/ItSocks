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
  

  const ruta_imagenes = './assets/accesorios/'
  return (
    
    <div className={ styles.card }>
      
      {/* <img src={ 	`${ ruta_imagenes }/${ nombre }.jpg` } alt= { nomSbre } /> */}
      <img src={ 	image } alt= { nombre } />
      
    </div>
    
  )
}
