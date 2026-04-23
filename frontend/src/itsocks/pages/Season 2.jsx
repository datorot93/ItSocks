import React from 'react'
import { ProductoList } from '../components/ProductoList'

import styles from "../../ui/styles/Accesorios.module.css";
import { ProductoListSeason } from '../components/ProductoListSeason';


export const Season = () => {
  return (
    <>
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.trancking_container}>
          </div>
                <>                  
                  <ProductoListSeason isPack={false} />
                </>
        </div>
      </div>
    </>
  )
}
