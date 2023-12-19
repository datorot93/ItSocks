//REACT
import React, { useEffect, useState } from 'react';

// UTILITIES
import InfiniteScroll from 'react-infinite-scroll-component';
import { types } from "../../types/types";


import { ProductoCard } from './ProductoCard';

// STYLES
import styles from '../../ui/styles/Accesorios.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getProductsByCatSubcatType, getProductsByCategory } from '../helpers/getProductsByCategory';

export const ProductoList = ({ categoria, subcategoria, type }) => {

  const [loading, setLoading] = useState(true);
  const [skip_page, setSkip] = useState(0);
  const [products, setProducts] = useState([]);

  const location = useLocation().pathname;
  
  const dispatch = useDispatch();

  const fetchItems = () => {
    setLoading(true);

    if(categoria && subcategoria && type){
      getProductsByCatSubcatType( 
        categoria, 
        subcategoria, 
        type, 
        skip_page
      ).then( res => setProducts( products => [...products, ...res] ));
    } else {
      getProductsByCategory( 
        categoria,
        skip_page
      ).then( res => setProducts( products => [...products, ...res] ));
    }
  }

  useEffect(() => {
    fetchItems();
  }, [skip_page]);

  // const products = useSelector((state) => state.product.products);

  console.log(loading)
  return (
    <>
      <InfiniteScroll
        dataLength={ products.length }
        next={ () => setSkip(skip_page => skip_page + 30) }
        hasMore={ true }
        loader={ <h4>Loading...</h4> }
      >
        <div className={styles.container}>
          <div className={styles.trancking_container}>
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
        </div>
        </div>
      </InfiniteScroll>
    </>
  )
}
