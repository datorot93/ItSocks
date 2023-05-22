import React from 'react'
import { ProductoList } from '../components/ProductoList'

import styles from '../../ui/styles/Accesorios.module.css';
import { ProductFilter } from '../components/ProductFilter';

export const Productos = ({ categoria, subcategoria }) => {
  
  return (
    <>
      <div className={ styles.main }>
        <div className={ styles.container }>
          <div className={ styles.trancking_container }>
            <h1>ACCESORIOS</h1>
          </div>
          <ProductoList categoria={ categoria } subcategoria={ subcategoria } />
          <ProductFilter subcategoria={ subcategoria }/>
        </div>
      </div>
    </>
  )
}
