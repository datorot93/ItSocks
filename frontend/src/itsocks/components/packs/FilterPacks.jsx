import React, { useEffect, useState } from "react";

// REACT-REDUX
import { useDispatch, useSelector } from "react-redux";

// React Reouter DOM
import { Link, useNavigate } from "react-router-dom";

// IMAGES
import xCircle from "../../../assets/navbar/x_circle.svg";

//UTILITIES
import { types } from "../../types/types";

import styles from "../../../ui/styles/Accesorios.module.css";
import { usePack } from "../../../hooks/usePack";

export const FilterPacks = ({ 
  lista_packs,
  showFilters,
  setShowFilters
}) => {

  console.log(showFilters)
  const initialState = {};

  const { createPack } = usePack();
  

  lista_packs.map((item) => {
    const key = item.name.toUpperCase();
    initialState[key] = false;
  });

  const [checkedItems, setCheckedItems] = useState(initialState);

  let subcategory = null;

  for (let clave in checkedItems) {
    if (checkedItems[clave] === true) {
      subcategory = clave;
      break;
    }
  }

  const pack_routes = {
    "4 Pares de medias largas": "largas",
    "3 Pares de medias largas": "largas",
    "4 Pares de pantorrilleras": "pantorrilleras",
    "3 Pares de pantorrilleras": "pantorrilleras",
    "4 Pares de media caña": "media_cania",
    "3 Pares de media caña": "media_cania",
  };

  const handleClick = (pack) => {

    const current_product = JSON.stringify(pack);
    const packs = JSON.stringify({ ...pack, prductos: [] });

    createPack({ ...pack, prductos: [] });

    localStorage.setItem("pack", packs);
  };


  return (
    <>

        <div className={showFilters ? `${styles.product_filter_pack} ${styles.visible}`: styles.product_filter_pack}>
          <div className={styles.x_circle} onClick={ () => setShowFilters(!showFilters)}>
            <img src={xCircle} alt="Cerrar Menu" />
          </div>
          {
          lista_packs.map((pack) => (
            
            <Link 
              to={pack_routes[pack.name]} 
              key={pack.name}
              onClick={ () => handleClick(pack) }
            >
              <button 
                className={styles.filter_buttons_packs}             
              >
                {pack.name}
              </button>
            </Link>
          ))}
        </div>
      
    </>
  );
};
