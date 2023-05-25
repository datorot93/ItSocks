import React from 'react';

import { Link } from 'react-router-dom';

// Utilidades
import { LazyLoadImage } from 'react-lazy-load-image-component';

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
  descripcion,
  images
}) => {
  

  const ruta_imagenes = './assets/accesorios/'

  const ruta = `/${categoria}/${ subcategoria == "estampadas" ? "estampadas/pantorrillera/" : ""}${nombre}`
  console.log(ruta);
  console.log(nombre);
  console.log(categoria);
  console.log(subcategoria);
  return (
    
    <div className={ styles.card }>
      
      {/* <img src={ 	`${ ruta_imagenes }/${ nombre }.jpg` } alt= { nomSbre } /> */}
      <Link
        to={ 
          ruta
        }
      >
      <LazyLoadImage src={ images[0] } alt= { nombre } />
      </Link>
      
    </div>
    
  )
}
