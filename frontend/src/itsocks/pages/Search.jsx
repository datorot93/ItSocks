import React from 'react'

import styles from "../../ui/styles/Accesorios.module.css";
import { SearchList } from '../components/SearchList';
import { useLocation } from 'react-router-dom';

export const Search = () => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const input = searchParams.get('input');

  return (
    <>
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.trancking_container}>
            {
              input ?
              <h1>{`RESULTADO DE LA BÚSQUEDA: ${input.toLocaleUpperCase()}`} </h1>
              :<h1>NO SE HA PROPORCIONADO NINGÚN VALOR DE BÚSQUEDA</h1>
            }
          </div>

          <SearchList input={input}/>
        </div>
      </div>
    </>
  )
}
