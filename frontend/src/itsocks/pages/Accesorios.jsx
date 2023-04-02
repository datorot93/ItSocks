import React from 'react'
import { ProductoList } from '../components/ProductoList'

import styles from '../../ui/styles/Accesorios.module.css';
import { ProductFilter } from '../components/ProductFilter';

export const Accesorios = () => {
  return (
    <>
      <div className={ styles.main }>
        <div className={ styles.container }>
          <div className={ styles.trancking_container }>
            <h1>ACCESORIOS</h1>
          </div>
          <ProductoList categoria="accesorios" />
          <ProductFilter />
        </div>
      </div>
    </>
  )
}
