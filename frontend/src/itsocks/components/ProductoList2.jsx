//REACT
import React, { useEffect, useState } from "react";

// ACTIONS
import { ProductoCard2 } from "./ProductoCard2";

// STYLES
import styles from "../../ui/styles/Accesorios.module.css";

// UTILITIES
import InfiniteScroll from 'react-infinite-scroll-component';
import { getProductsByTags, getProductsByTagsSubcategory, getProductsByTagsSubcategoryCompresion, getProductsByTagsType, getProductsByTagsTypeCompresion } from "../helpers/getProductByTags";
import { useLocation } from "react-router-dom";

export const ProductoList2 = ({estilo, filtro}) => {

  const [products, setProducts] = useState([]);
  const [skip_page, setSkip] = useState(0);

  const location = useLocation().pathname;
  const tag_filter = location.split('/')[3] ? 
          location.split('/')[3].replace('media_cania', 'Media caña').toLowerCase()
          : '';

  useEffect(() => {
    if( location.split('/').length === 2 ) {
      getProductsByTags( estilo, skip_page )
        .then( 
          res => {          
            return setProducts( products => [...products, ...res] )
          }
        );
    }else if ( location.split('/').length == 4 && filtro === 'estilo') {
      getProductsByTagsType( estilo, tag_filter, skip_page )
        .then( 
          res => {        

            return setProducts( products => [...products, ...res] )
          }
        );
    }else if ( location.split('/').length == 4 && filtro === 'tipo') {
      getProductsByTagsSubcategory( estilo, tag_filter, skip_page )
        .then( 
          res => {        

            return setProducts( products => [...products, ...res] )
          }
        );
    }else if ( location.split('/').length > 4 && filtro === 'estilo') {
      console.log('ENTRÉ AL FILTRO DE COMPRESIÓN ESTILO')
      let compresion_filter = location.split('/')[4]
      getProductsByTagsTypeCompresion( estilo, tag_filter, compresion_filter, skip_page )
        .then( 
          res => {
            return setProducts(  products => [...products, ...res] )
          }
        );
    }else if ( location.split('/').length > 4 && filtro === 'tipo') {
      console.log('ENTRÉ AL FILTRO DE COMPRESIÓN TIPO')
      let compresion_filter = location.split('/')[4]
      getProductsByTagsSubcategoryCompresion( estilo, tag_filter, compresion_filter, skip_page )
        .then( 
          res => {        
            return setProducts(  products => [...products, ...res] )
          }
        );
    }
  }, [skip_page, location]);
  
  useEffect(() => {
    setProducts([]);
    setSkip(0);
  }, [location]);

  useEffect(() => {
    // Scroll hacia arriba al cargar la página
    window.scrollTo(0, 0);
  }, []);


  return (
    <InfiniteScroll
          dataLength={ products.length }
          next={ () => setSkip(skip_page => skip_page + 30) }
          hasMore={ true }
          loader={ <h4></h4> }
        >

          <div className={styles.products_container}>
            {products.map((producto, index) => (
              <ProductoCard2 key={index} {...producto} />
            ))}
          </div>
        </InfiniteScroll>
  );
};
