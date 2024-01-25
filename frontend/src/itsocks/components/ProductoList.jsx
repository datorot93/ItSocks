//REACT
import React, { useState } from 'react';

// UTILITIES
import InfiniteScroll from 'react-infinite-scroll-component';

import { ProductoCard } from './ProductoCard';
import {useFetchItems} from '../../hooks/useFetchItems';

// STYLES
import styles from '../../ui/styles/Accesorios.module.css';
import { useLocation } from 'react-router-dom';


export const ProductoList = ({ categoria, subcategoria, type, isPack }) => {

  const [skip_page, setSkip] = useState(0);

  const location = useLocation().pathname;

  const design = location.split('/')[4] ? location.split('/')[4] : null;


  const { products } = !isPack ? 
    useFetchItems(skip_page, setSkip, location, design, categoria, subcategoria, type)
    : [];

  console.log('ESTOS SON LOS PRODUCTOS')
  console.log(products)
  return (
    <>
      {
        products && products.length > 0 ? 
        <InfiniteScroll
          dataLength={ products.length }
          next={ () => setSkip(skip_page => skip_page + 30) }
          hasMore={ true }
          loader={ <h4></h4> }
        >
          <div className={styles.container}>
            <div className={styles.trancking_container}>
              <div className={ styles.products_container }>            
                {
                  Object.keys(products).map( producto => (
                    
                      <ProductoCard 
                        key={ producto }
                        { ...products[producto] }
                        isPack={ isPack }
                      />
                  ))
                }
              </div>
            </div>
          </div>
        </InfiniteScroll>
        : <></>
      }
    </>
  )
}

