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

  return (
    <div className={styles.card}>
      <Link to={pack.to} onClick={handleClick}>
        <LazyLoadImage src={pack.imagen} alt={pack.nombre} />
        <div className={styles.product_info}>
          <p>{pack.nombre} asdfasdfa sdf asdf as</p>
        </div>
      </Link>
    </div>
  );
};
