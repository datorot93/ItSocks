//REACT
import React, { useEffect, useState } from "react";

// ACTIONS
import { ProductoCard2 } from "./ProductoCard2";

// STYLES
import styles from "../../ui/styles/Accesorios.module.css";

// UTILITIES
import InfiniteScroll from 'react-infinite-scroll-component';
import { getProductsByTags } from "../helpers/getProductByTags";

export const ProductoList2 = ({estilo}) => {

  const [products, setProducts] = useState([]);
  const [skip_page, setSkip] = useState(0);

  useEffect(() => {
    getProductsByTags( estilo, skip_page )
      .then( 
        res => {          
          return setProducts( products => [...products, ...res] )
        }
      );
  }, [skip_page]);

  return (
    <InfiniteScroll
          dataLength={ products.length }
          next={ () => setSkip(skip_page => skip_page + 30) }
          hasMore={ true }
          loader={ <h4></h4> }
        >

          <div className={styles.products_container}>
            {products.map((producto) => (
              <ProductoCard2 key={producto.id} {...producto} />
            ))}
          </div>
        </InfiniteScroll>
  );
};
