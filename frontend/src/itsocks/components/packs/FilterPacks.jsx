import React, { useEffect, useState } from "react";

// REACT-REDUX
import { useDispatch, useSelector } from "react-redux";

// React Reouter DOM
import { Link, useNavigate } from "react-router-dom";

//UTILITIES
import { types } from "../../types/types";

import styles from "../../../ui/styles/Accesorios.module.css";
import { usePack } from "../../../hooks/usePack";

export const FilterPacks = ({ lista_packs }) => {
  const initialState = {};

  console.log('ESTA ES LA LISTA PACKS')
  console.log(lista_packs)

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
    "PARES DE MEDIAS LARGAS X4": "largas",
    "PARES DE MEDIAS LARGAS X3": "largas",
    "PARES DE MEDIAS PANTORRILLERAS X4": "pantorrilleras",
    "PARES DE MEDIAS PANTORRILLERAS X3": "pantorrilleras",
    "PARES DE MEDIAS MEDIA CAÑA X4": "media_cania",
    "PARES DE MEDIAS MEDIA CAÑA X3": "media_cania",
  };

  const handleClick = (pack) => {
    console.log('ESTE ES EL PACK FILTRO')
    console.log(pack)
    const current_product = JSON.stringify(pack);
    const packs = JSON.stringify({ ...pack, prductos: [] });

    createPack({ ...pack, prductos: [] });

    localStorage.setItem("pack", packs);
  };


  return (
    <>

        <div className={styles.product_filter}>
          {
          lista_packs.map((pack) => (
            
            <Link 
              to={pack_routes[pack.name.toUpperCase()]} 
              key={pack.name}
              onClick={ () => handleClick(pack) }
            >
              <button 
                className={styles.filter_buttons}             
              >
                {pack.name.toUpperCase()}
              </button>
            </Link>
          ))}
        </div>
      
    </>
  );
};
