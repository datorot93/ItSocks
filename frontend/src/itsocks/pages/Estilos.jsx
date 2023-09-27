import React from 'react'
import { getProductsByTags } from '../helpers/getProductByTags';
import { ProductoList2 } from '../components/ProductoList2';
import { ProductFilter } from '../components/ProductFilter';

import styles from '../../ui/styles/Accesorios.module.css';


export const Estilos = ({ estilo }) => {
  
  const productos = getProductsByTags( estilo );

  // console.log(productos);
  return (
    <>
      <div className={ styles.main }>
        <div className={ styles.container }>
          <div className={ styles.trancking_container }>
            <h1>{estilo.toUpperCase()}</h1>
          </div>
          <ProductoList2 products = { productos } />
          
        </div>
      </div>
    </>
  )
}
