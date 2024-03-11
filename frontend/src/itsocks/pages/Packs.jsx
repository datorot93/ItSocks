import React, { useEffect, useRef, useState } from "react";

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
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPacks();
        setResultado(data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    }

    fetchData();
  }, []);

  console.log(resultado)

  return (
    <>
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.trancking_container}>
            <h1>{"PACKS"} </h1>
          </div>
          {resultado ? (
            <>
              <ListaPacks lista_packs={resultado} />
              <FilterPacks lista_packs={resultado.sort((a, b) => a.name.localeCompare(b.name)) } />
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};
