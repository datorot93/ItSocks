import React from "react";

import { Link } from "react-router-dom";

// Utilidades
import { LazyLoadImage } from "react-lazy-load-image-component";

import styles from "../../../ui/styles/Accesorios.module.css";
import { useDispatch } from "react-redux";
import { types } from "../../types/types";

import { PACK_ACTION_TYPES } from "../../../reducers/packReducer";
import { usePack } from "../../../hooks/usePack";

export const PackCard = (pack) => {


  // console.log('ESTE ES EL PACK CARD')
  // console.log(pack)


  const { createPack } = usePack();

  const handleClick = () => {

    const current_product = JSON.stringify(pack);
    const packs = JSON.stringify({ ...pack, prductos: [] });

    createPack({ ...pack, prductos: [] }); 

    localStorage.setItem("pack", packs);
  };

  const pack_routes = {
    "4 Pares de medias largas": "largas",
    "3 Pares de medias largas": "largas",
    "4 Pares de pantorrilleras": "pantorrilleras",
    "3 Pares de pantorrilleras": "pantorrilleras",
    "4 Pares de media caña": "media_cania",
    "3 Pares de media caña": "media_cania",
  };

  return (
    <div className={styles.card}>
      <Link to={pack_routes[pack.name]} onClick={handleClick}>
        <LazyLoadImage src={pack.image_url} alt={pack.name} />
        <div className={styles.product_info}>
          <p><strong>{pack.name}</strong></p>
          <p>{`${pack.price.toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })}`}</p>
        </div>
      </Link>
    </div>
  );
};
