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

  let toPath = "";
  const compresion = product.compresion ? 'medias_de_compresion' : 'medias_sin_compresion';
  if (pathname.split("/").length === 5){
    toPath =product.name.toLowerCase()
  } else if (pathname.split("/").length === 4){
    toPath = `${compresion}/${product.name.toLowerCase()}`
  } else if (pathname.split("/").length === 2){
    if(pathname.split("/")[2] === "tipo_media"){
      toPath = `tipo_media/${product.subcategory.toLowerCase()}/${compresion}/${product.name.toLowerCase()}`
    }else {
      toPath = `estilo_media/${product.type.toLowerCase().replaceAll('media caña', 'media_cania')}/${compresion}/${product.name.toLowerCase()}`
    }
  }

  return (
    
    <div className={ styles.card }>
      
      <Link 
          // to={`${pathname.split("/").length === 2 ? product.design.toLowerCase() + "/" + product.name.toLowerCase(): product.name.toLowerCase()}`}
          to={`${toPath}`}
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
