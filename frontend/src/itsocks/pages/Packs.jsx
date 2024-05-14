import React, { useEffect, useRef, useState } from "react";

// ACTIONS
import { getProductsList } from "../../actions/getProductsList";

// REACT REDUX
import { useDispatch, useSelector } from "react-redux";

// IMAGES
import filters_icon from "../../assets/navbar/filters_icon.svg";

// ESTILOS
import styles from "../../ui/styles/Accesorios.module.css";

// COMPONENTS
import { ListaPacks } from "../components/packs/ListaPacks";
import { FilterPacks } from "../components/packs/FilterPacks";
import { getPacks } from "../helpers/getPacks";

export const Packs = () => {
  const [resultado, setResultado] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

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

  const handleButtonFilters = () => {
    setShowFilters(!showFilters);
  }

  return (
    <>
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.trancking_container}>
            <h1>{"PACKS"} </h1>
          </div>
            <div className={ styles.filters_button_container} onClick={ handleButtonFilters }>
            <img src={ filters_icon } alt="icono filtros" />
            <p>Filtros</p>
          </div>
          {resultado ? (
            <>
              <ListaPacks lista_packs={resultado} />
              <FilterPacks 
                lista_packs={resultado.sort((a, b) => a.name.localeCompare(b.name)) }
                showFilters={showFilters}
                setShowFilters={setShowFilters}
              />
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};
