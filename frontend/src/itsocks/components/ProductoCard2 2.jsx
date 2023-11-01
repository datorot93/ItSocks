import React from 'react';

import { Link } from 'react-router-dom';

// Utilidades
import { LazyLoadImage } from 'react-lazy-load-image-component';

import styles from '../../ui/styles/Accesorios.module.css';
import { getSpecificProduct } from '../../actions/getSpecificProduct';
import { useDispatch } from 'react-redux';



export const ProductoCard2 = ( product ) => {

  const ruta = `/${product.categoria}/${ product.subcategoria == "estampadas" ? "estampadas/pantorrillera/" : ""}${product.nombre}`

  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch( getSpecificProduct( product ));
    const current_product = JSON.stringify(product);

    localStorage.setItem('current_product', current_product);
  };

  return (
    
    <div className={ styles.card }>
      
      {/* <img src={ 	`${ ruta_imagenes }/${ nombre }.jpg` } alt= { nomSbre } /> */}
      <Link
        to={ 
          ruta
        }
        onClick={ handleClick }
      >
        <LazyLoadImage src={ product.images[0] } alt= { product.nombre } />
        <div className={ styles.product_info }>
          <p>{ product.nombre }</p>
          <p>{ product.precio }</p>
        </div>
      </Link>
      
    </div>
    
  )
}
