//REACT
import React from 'react';

// ACTIONS
import { PackProductoCard } from './PackProductoCard';

// STYLES
import styles from '../../../ui/styles/Accesorios.module.css';

export const PackProductoList = ( {products} ) => {

  // console.log( products );


    return (    
        <div className={ styles.products_container }>            
        {
            Object.keys(products).map( producto => (
            
                <PackProductoCard 
                key={ producto }
                { ...products[producto] }
                />
            
            ))
        }
        </div>     
    )
}
