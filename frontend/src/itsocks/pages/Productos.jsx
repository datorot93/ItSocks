//REACT
import React, { useEffect, useRef, useState } from "react";

//UTILITIES

//REACT-REDUX
import { useDispatch, useSelector } from "react-redux";

import { ProductoList } from "../components/ProductoList";

import styles from "../../ui/styles/Accesorios.module.css";
import { ProductFilter } from "../components/ProductFilter";
import { useLocation } from "react-router-dom";

export const Productos = ({ categoria, subcategoria, type }) => {

  const location = useLocation().pathname;

  return (
    <>
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.trancking_container}>
            <h1>{categoria?.toUpperCase()} </h1>
            </div>
                <>
                  {
                    location.split('/').length !== 5?
                    <>
                      <ProductoList
                        categoria={categoria}
                        subcategoria={subcategoria}
                        type={type}
                      //  products={products}
                      />
                      {/* <div className={ styles.relleno }></div> */}
                      <ProductFilter
                        subcategoria={subcategoria}
                        categoria={categoria}
                        type={type}
                      />
                    </>
                    :<>
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
                  }
                  
                </>
        </div>
      </div>
    </>
  );
};
