//REACT
import React, { useState } from "react";


import styles from "../../ui/styles/Accesorios.module.css";
import { PackProductoList } from "../components/packs/PackProductList";
import { PackProductFilter } from "../components/packs/PackProductFilter";

// IMAGES
// import filters_icon from "../../../assets/navbar/filters_icon.svg";
import filters_icon from "../../assets/navbar/filters_icon.svg";


export const PacksProducts = ({ categoria, type }) => {

  const [showFilters, setShowFilters] = useState(false);

  const handleButtonFilters = () => {
    setShowFilters(!showFilters);
  }

  return (
    <>
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.trancking_container}>
            <h1>{categoria?.toUpperCase()} </h1>
          </div>

            <div className={ styles.filters_button_container} onClick={ handleButtonFilters }>
              <img src={ filters_icon } alt="icono filtros" />
              <p>Filtros</p>
            </div>

          <PackProductoList 
            categoria={categoria}
            type={type}
          />

          <PackProductFilter 
            categoria={categoria} type={type} 
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
        
        </div>
      </div>
    </>
  );
};
