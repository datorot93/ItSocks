//REACT
import React from "react";


import styles from "../../ui/styles/Accesorios.module.css";
import { PackProductoList } from "../components/packs/PackProductList";
import { PackProductFilter } from "../components/packs/PackProductFilter";

export const PacksProducts = ({ categoria, type }) => {


  return (
    <>

      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.trancking_container}>
            <h1>{categoria?.toUpperCase()} </h1>
          </div>
          <PackProductoList 
            categoria={categoria}
            type={type}
          />

          <PackProductFilter categoria={categoria} type={type} />
        
        </div>
      </div>
    </>
  );
};
