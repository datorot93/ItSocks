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
import { getPacks } from "../helpers/getPacks";

export const Packs = () => {
  const mounted = useRef(true);
  const dispatch = useDispatch();

  const lista_packs = getPacks();

  return (
    <>
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.trancking_container}>
            <h1>{"PACKS"} </h1>
          </div>
          <ListaPacks lista_packs={lista_packs} />
          <FilterPacks lista_packs={lista_packs} />
        </div>
      </div>
    </>
  );
};
