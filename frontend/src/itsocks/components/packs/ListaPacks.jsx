//REACT
import React from "react";

// ACTIONS
import { PackCard } from "./PackCard";

// DATA
// import { lista_packs } from "../../data/packs";

// STYLES
import styles from "../../../ui/styles/Accesorios.module.css";

export const ListaPacks = ({ lista_packs }) => {
  return (
    <div className={styles.products_container}>
      {Object.keys(lista_packs).map((pack) => (
        <PackCard key={pack} {...lista_packs[pack]} />
      ))}
    </div>
  );
};
