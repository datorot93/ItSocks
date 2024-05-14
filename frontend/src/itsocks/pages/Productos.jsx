//REACT
import React, { useState } from "react";

//IMAGES
import filters_icon from "../../assets/navbar/filters_icon.svg";
// import filters_icon from "../../assets/producto/filters_icon.svg";

//REACT-REDUX
import { useDispatch, useSelector } from "react-redux";

import { ProductoList } from "../components/ProductoList";

import styles from "../../ui/styles/Accesorios.module.css";
import { ProductFilter } from "../components/ProductFilter";

export const Productos = ({ categoria, subcategoria, type, match }) => {

  const [showFilters, setShowFilters] = useState(false);
  const [showButtonFilters, setShowButtonFilters] = useState(false);

  const obj_nombres = {
    "larga": "Largas",
    "media_cania": "Media caña",
    "pantorrillera": "Pantorrilleras",
    "accesorios": "Accesorios",
  }

  const handleButtonFilters = () => {
    setShowFilters(!showFilters);
  }


  return (
    <>
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.trancking_container}>
            {
              type ? 
              <h1>{type === 'Media caña' || type === 'Pantorrilleras' ? `${type.toUpperCase()}` : `MEDIAS ${type.toUpperCase()}`}</h1>
              : <h1>{categoria?.toUpperCase()} </h1>
            }
          </div>
          <button className={ styles.filters_button_container} onClick={ handleButtonFilters }>
            <img src={ filters_icon } alt="icono filtros" />
            <p>Filtrar</p>
          </button>
                <>                  
                  <ProductoList
                    categoria={categoria}
                    subcategoria={subcategoria}
                    type={type}
                  />
                  <ProductFilter
                    subcategoria={subcategoria}
                    categoria={categoria}
                    type={type}
                    // setShowFilters={setShowFilters}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                  />
                </>
        </div>
      </div>
    </>
  );
};
