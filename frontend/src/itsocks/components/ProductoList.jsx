import React, { useContext, useMemo } from 'react';
import { getProductsByCategory } from '../helpers/getProductsByCategory';
import { getProductsBySubCategory } from '../helpers/getProductsBySubCategory';
import { ProductoCard } from './ProductoCard';

import styles from '../../ui/styles/Accesorios.module.css';
// import { ItSocksContext } from '../context/ItSocksContext';

export const ProductoList = ( { categoria, subcategoria } ) => {

  // const { productos } = useContext( ItSocksContext );
  let productos = null;
  
  if (subcategoria){
    productos = getProductsBySubCategory( categoria, subcategoria );
  }else{
    productos = getProductsByCategory( categoria );
  }

  return (    
      <div className={ styles.products_container }>
        {
          productos.map( producto => (
            <ProductoCard 
              key={ producto.id }
              { ...producto }
            />
          ))
        }
      </div>    
  )
}
