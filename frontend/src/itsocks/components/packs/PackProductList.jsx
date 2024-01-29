//REACT
import React, { useState } from "react";

// ACTIONS
import { PackProductoCard } from "./PackProductoCard";

// UTILITIES
import InfiniteScroll from 'react-infinite-scroll-component';

// STYLES
import styles from "../../../ui/styles/Accesorios.module.css";
import { useLocation } from "react-router-dom";
import { useFetchPackItems } from "../../../hooks/useFetchPacksItems";

export const PackProductoList = ({ categoria, type }) => {

  const [skip_page, setSkip] = useState(0);

  const location = useLocation().pathname;

  const design = location.split('/')[3] ? location.split('/')[3] : null;
  
  const { products } = useFetchPackItems(skip_page, setSkip, location, categoria, type)

  console.log(products)

  return (
    <InfiniteScroll
      dataLength={ products ? products.length : 0}
      next={ () => setSkip(skip_page => skip_page + 30) }
      hasMore={ true }
      loader={ <h4></h4> }
    >

      <div className={styles.container}>
            <div className={styles.trancking_container}>
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
            </div>
          </div>
    </InfiniteScroll>
  );
};
