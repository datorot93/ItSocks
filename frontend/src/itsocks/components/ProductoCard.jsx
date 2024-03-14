import React from "react";

import { Link, useLocation } from "react-router-dom";

// Utilidades
import { LazyLoadImage } from "react-lazy-load-image-component";

import styles from "../../ui/styles/Accesorios.module.css";
import 'animate.css';

export const ProductoCard = (product, isPack) => {

  // console.log('ESTE ES EL PRODUCTO')
  // console.log(product)

  const { pathname } = useLocation();

  const handleClick = () => {

    const current_product = JSON.stringify(product);

    localStorage.setItem("current_product", current_product);
  };

  let toPath = "";
  const compresion = product.compresion ? 'medias_de_compresion' : 'medias_sin_compresion';
  if (pathname.split("/").length === 6 || pathname.split("/").length === 2){
    toPath =product.name.toLowerCase()
  } else if (pathname.split("/").length === 5){
    
    toPath = `${compresion}/${product.name.toLowerCase()}`
  } else if (pathname.split("/").length === 4){
    toPath = `${product.design.toLowerCase()}/${compresion}/${product.name.toLowerCase()}`
  }

  // console.log(toPath)

  return (
    <div className={`${styles.card} animate__animated animate__fadeIn`}>
      {
        pathname.toLowerCase().split("/")[1] == "accesorios" ?
          
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
      : 
      <Link 

        to={toPath}
        onClick={handleClick}>
      <LazyLoadImage src={product.images.image1} alt={product.name} />
      <div className={styles.product_info}>
        <p>
          <strong>{product.name}</strong>
        </p>
        { 
          isPack ?
            <p>
              {product.price.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}
            </p>
          : <></>
        }
        
      </div>
    </Link>
      }
      
    </div>
  );
};
