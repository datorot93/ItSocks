import React from "react";

import { Link } from "react-router-dom";

// Utilidades
import { LazyLoadImage } from "react-lazy-load-image-component";

import styles from "../../../ui/styles/Accesorios.module.css";
import { useDispatch } from "react-redux";
import { types } from "../../types/types";

export const PackCard = (pack) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    const current_product = JSON.stringify(pack);
    const packs = JSON.stringify({ ...pack, prductos: [] });

    localStorage.setItem("pack", packs);
  };

  const pack_routes = {
    "PARES DE MEDIAS LARGAS X4": "largas",
    "PARES DE MEDIAS LARGAS X3": "largas",
    "PARES DE PANTORRILLERAS X4": "pantorrilleras",
    "PARES DE PANTORRILLERAS X3": "pantorrilleras",
    "PARES MEDIA CAÑA X4": "media_cania",
    "PARES MEDIA CAÑA X3": "media_cania",
  };

  console.log(pack_routes[pack.name]);

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
