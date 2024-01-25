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


  console.log('ESTE ES EL PACK CARD')
  console.log(pack)

  const dispatch = useDispatch();

  const { createPack } = usePack();

  const handleClick = () => {

    const current_product = JSON.stringify(pack);
    const packs = JSON.stringify({ ...pack, prductos: [] });

    createPack({ ...pack, prductos: [] });

    localStorage.setItem("pack", packs);
  };

  const pack_routes = {
    "PARES DE MEDIAS LARGAS X4": "largas",
    "PARES DE MEDIAS LARGAS X3": "largas",
    "PARES DE MEDIAS PANTORRILLERAS X4": "pantorrilleras",
    "PARES DE MEDIAS PANTORRILLERAS X3": "pantorrilleras",
    "PARES DE MEDIAS MEDIA CAÑA X4": "media_cania",
    "PARES DE MEDIAS MEDIA CAÑA X3": "media_cania",
  };

  return (
    <div className={styles.card}>
      <Link to={pack_routes[pack.name.toUpperCase()]} onClick={handleClick}>
        <LazyLoadImage src={pack.image_url} alt={pack.name} />
        <div className={styles.product_info}>
          <p>{pack.name.toUpperCase()}</p>
        </div>
      </Link>
    </div>
  );
};
