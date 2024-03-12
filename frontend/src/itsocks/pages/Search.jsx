import React from 'react'

import styles from "../../ui/styles/Accesorios.module.css";

export const Search = () => {
  return (
    <>
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.trancking_container}>
            <h1>{"RESULTADO DE LA BÚSQUEDA"} </h1>
          </div>
          {/* {resultado ? (
            <>
              <ListaPacks lista_packs={resultado} />
            </>
          ) : (
            <></>
          )} */}
        </div>
      </div>
    </>
  )
}
