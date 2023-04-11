import React, { useContext, useMemo } from 'react';
import { getProductsByCategory } from '../helpers/getProductsByCategory';
import { ProductoCard } from './ProductoCard';

import styles from '../../ui/styles/Accesorios.module.css';
import { ItSocksContext } from '../context/ItSocksContext';

export const ProductoList = ( { categoria } ) => {

  const { productos } = useContext( ItSocksContext );


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
