import React, { useEffect, useState } from 'react'
import { getProductsByTags } from '../helpers/getProductByTags';
import { ProductoList2 } from '../components/ProductoList2';
import { ProductFilter } from '../components/ProductFilter';

import styles from '../../ui/styles/Accesorios.module.css';
import { TagFilter } from '../components/TagFilter';


export const Estilos = ({ estilo, filtro }) => {
  // const productos = getProductsByTags( estilo );

  

  return (
    <>
      <div className={ styles.main }>
        <div className={ styles.container }>
          <div className={ styles.trancking_container }>
            <h1>{estilo.toUpperCase()}</h1>
          </div>
          <TagFilter estilo={estilo} filtro={filtro}/>
          <ProductoList2 estilo={estilo} filtro={filtro}/>
        </div>
      </div>
    </>
  )
}
