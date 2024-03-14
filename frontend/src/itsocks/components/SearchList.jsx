//REACT
import React, { useEffect, useState } from 'react';

// UTILITIES
import InfiniteScroll from 'react-infinite-scroll-component';

import { ProductoCard } from './ProductoCard';
import {useFetchItems} from '../../hooks/useFetchItems';

// STYLES
import styles from '../../ui/styles/Accesorios.module.css';
import 'animate.css';

// REACT-ROUTER-DOM
import { useLocation } from 'react-router-dom';
import { getSearchedProudcts } from '../helpers/getSearch';


export const SearchList = ({ input }) => {

  const [skip_page, setSkip] = useState(0);
  const [products, setProducts] = useState([]);

  const search = useLocation().search;

  // const searchParams = new URLSearchParams(location.search);
  // const input = searchParams.get('input');


  useEffect(() => {
    // Scroll hacia arriba al cargar la página
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setProducts([])
    setSkip(0)
  }, [search])

  useEffect(() => {
    console.log('ENTRÉ AL USEEFFECT DE SEARCHLIST')
    getSearchedProudcts(input, skip_page).then(
      res => setProducts([ ...products, ...res])
    ).catch(
      err => console.log(err)
    )
  }, [skip_page, search])
  // const { products } = useFetchItems(skip_page, setSkip, location, design, categoria, subcategoria, type);
  console.log(products)
  console.log(search)
  return (
    <>
      {
        products && products.length > 0 ? 
        <InfiniteScroll
          dataLength={ products ? products.length : 0}
          next={ () => setSkip(skip_page => skip_page + 15) }
          
          hasMore={ true }
          loader={ <h4></h4> }
        >
          <div className={`${styles.container}`}>
            <div className={styles.trancking_container}>
              <div className={ `${styles.products_container}` }>            
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
        : <></>
      }
    </>
  )
}

