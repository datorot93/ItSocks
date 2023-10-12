import React, { useEffect, useRef } from "react";

// ACTIONS
import { getProductsList } from "../../actions/getProductsList";

// REACT REDUX
import { useDispatch, useSelector } from "react-redux";

// ESTILOS
import styles from "../../ui/styles/Accesorios.module.css";

// COMPONENTS
import { ListaPacks } from "../components/packs/ListaPacks";
import { FilterPacks } from "../components/packs/FilterPacks";

export const Packs = () => {
  const mounted = useRef(true);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.trancking_container}>
            <h1>{"PACKS"} </h1>
          </div>
          <ListaPacks />
          <FilterPacks />
        </div>
      </div>
    </>
  );
};
