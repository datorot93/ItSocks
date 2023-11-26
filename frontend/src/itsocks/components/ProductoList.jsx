//REACT
import React from 'react';

// ACTIONS
import { ProductoCard } from './ProductoCard';

// STYLES
import styles from '../../ui/styles/Accesorios.module.css';

export const ProductoList = ( {products} ) => {

  // console.log( products );


  return (    
      <div className={ styles.products_container }>            
        {
          Object.keys(products).map( producto => (
            
              <ProductoCard 
                key={ producto }
                { ...products[producto] }
              />
            
          ))
        }
      </div>     
  )
}
