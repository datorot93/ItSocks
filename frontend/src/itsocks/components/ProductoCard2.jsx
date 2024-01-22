import React from 'react';

import { Link, useLocation } from 'react-router-dom';

// Utilidades
import { LazyLoadImage } from 'react-lazy-load-image-component';

import styles from '../../ui/styles/Accesorios.module.css';
import { getSpecificProduct } from '../../actions/getSpecificProduct';
import { useDispatch } from 'react-redux';




export const ProductoCard2 = ( product ) => {
  
  const { pathname } = useLocation();
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
          to={`${pathname.split("/").length === 2 ? product.design.toLowerCase() + "/" + product.name.toLowerCase(): product.name.toLowerCase()}`}
          onClick={handleClick}
        >
        
        <LazyLoadImage src={product.images.image1} alt={product.name} />
        <div className={styles.product_info}>
          <p>
            <strong>{product.name}</strong>
          </p>
          <p>
            {product.price.toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })}
          </p>
        </div>
      </Link>
      
    </div>
    
  )
}
