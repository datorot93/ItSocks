//REACT
import React, { useEffect, useMemo, useRef } from 'react';

// ACTIONS
import { getProductsBySubCategory } from '../helpers/getProductsBySubCategory';
import { getProductsList } from '../../actions/getProductsList';

//UTILITIES
import { types } from '../../types/types';

//REACT-REDUX
import { useDispatch, useSelector } from 'react-redux';

import { ProductoList } from '../components/ProductoList';

import styles from '../../ui/styles/Accesorios.module.css';
import { ProductFilter } from '../components/ProductFilter';
import { ProductFilter2 } from '../components/ProductFilter2';

export const Productos = ({ categoria, subcategoria }) => {
  // console.log(subcategoria);

  const mounted = useRef( true );
  const dispatch = useDispatch();

  useEffect( () => {
    if( mounted ){
      dispatch( getProductsList( categoria ));
    }

    return ( () => {
      mounted.current = false;
      dispatch({
        type: types.unmountProducts
      })
    })
  }, []);
  
  const products = useSelector( state => state.product.products )
  // console.log('ESTOS SON LOS PRODUCTOS');
  // console.log(products);

  return (
    <>
      <div className={ styles.main }>
        <div className={ styles.container }>
          <div className={ styles.trancking_container }>
            <h1>{categoria?.toUpperCase()}</h1>
          </div>
          <ProductoList products = { products } />
          <ProductFilter subcategoria={ subcategoria } products={ products }/>
          {/* {
            categoria == 'accesorios' ? 
            <ProductFilter subcategoria={ subcategoria }/>
            : <ProductFilter2 subcategoria={ subcategoria } />
          } */}
        </div>
      </div>
    </>
  )
}
