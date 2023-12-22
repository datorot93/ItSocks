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
import { 
  getProductsByCatSubcatType, 
  getProductsByCategory, 
  getProductsByCatSubcatTypeDesign,
  getProductsByCategoryDesign
} from '../helpers/getProductsByCategory';

export const ProductoList = ({ categoria, subcategoria, type }) => {

  const [loading, setLoading] = useState(true);
  const [skip_page, setSkip] = useState(0);
  const [products, setProducts] = useState([]);

  const location = useLocation().pathname;

  const design = location.split('/')[4] ? location.split('/')[4] : null;

  const fetchItems = () => {
    setLoading(true);

    if(categoria && subcategoria && type){
      if(location.split("/").length != 5 && location.split("/")[1].toLowerCase() !== 'accesorios'){
        getProductsByCatSubcatType( 
          categoria, 
          subcategoria, 
          type, 
          skip_page
        ).then( 
          res => {            
            return setProducts( products => [...products, ...res] )
          }
        );
      } else {
        getProductsByCatSubcatTypeDesign( 
          categoria, 
          subcategoria, 
          type,
          design.replace('%20', ' '),
          skip_page
        ).then( 
          res => {            
            return setProducts( products => [...products, ...res] )
          }
        );
      }
    } else{
      if(location.split("/").length == 2 && location.split("/")[1].toLowerCase() === 'accesorios'){
        // console.log('Entré al if de accesorios')
        getProductsByCategory( 
          categoria,
          skip_page
        ).then( 
          res => {            
            return setProducts( products => [...products, ...res] )
          }
        );
      }else if (location.split("/").length === 3) {
        // console.log('Entré al otro if de accesorios')
        const disenio = location.split("/")[2].replace('%20', ' ').toLowerCase();
        getProductsByCategoryDesign(
          categoria,
          disenio,
          skip_page
        ).then( 
          res => {            
            return setProducts( products => [...products, ...res] )
          }
        );
      }
    }
  }

  useEffect(() => {
    console.log('Me ejecuté')
    setProducts([]);
    setSkip(0);
  }, [location]);

  useEffect(() => {
    fetchItems();
  }, [skip_page]);

  

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

