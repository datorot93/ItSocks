import React from 'react'
import { ProductoList } from '../components/ProductoList'

import styles from '../../ui/styles/Accesorios.module.css';
import { ProductFilter } from '../components/ProductFilter';
import { ProductFilter2 } from '../components/ProductFilter2';

export const Productos = ({ categoria, subcategoria }) => {
  console.log(subcategoria);
  return (
    <>
      <div className={ styles.main }>
        <div className={ styles.container }>
          <div className={ styles.trancking_container }>
            <h1>{categoria?.toUpperCase()}</h1>
          </div>
          <ProductoList categoria={ categoria } subcategoria={ subcategoria } />
          {
            categoria == 'accesorios' ? 
            <ProductFilter subcategoria={ subcategoria }/>
            : <ProductFilter2 subcategoria={ subcategoria } />
          }
        </div>
      </div>
    </>
  )
}
