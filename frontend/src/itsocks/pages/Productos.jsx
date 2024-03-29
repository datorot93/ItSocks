//REACT
import React, { useEffect, useRef, useState } from "react";

//UTILITIES

//REACT-REDUX
import { useDispatch, useSelector } from "react-redux";

import { ProductoList } from "../components/ProductoList";

import styles from "../../ui/styles/Accesorios.module.css";
import { ProductFilter } from "../components/ProductFilter";
import { useLocation } from "react-router-dom";

export const Productos = ({ categoria, subcategoria, type, match }) => {
  const obj_nombres = {
    "larga": "Largas",
    "media_cania": "Media caña",
    "pantorrillera": "Pantorrilleras",
    "accesorios": "Accesorios",
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
                  />
                </>
        </div>
      </div>
    </>
  );
};
