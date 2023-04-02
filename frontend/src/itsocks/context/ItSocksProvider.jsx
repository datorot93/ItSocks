import React from 'react';
import { useReducer } from 'react';
import { productos } from '../data/productos';
import { types } from '../types/types';
import { ItSocksContext } from './ItSocksContext';
import { itSocksReducer } from './itSocksReducer'


const initialData = () => {

  const products = productos

  return {
    productos: products
  }
}


export const ItSocksProvider = ({ children }) => {
  const [ itSocksState, dispatch ] = useReducer( itSocksReducer, {}, initialData );

  const setProducts = ( productos = [] ) => {
    // console.log("Estos son los productos");
    // console.log(productos)
    const action = {
      type: types.setProducts,
      payload: productos
    };

    dispatch( action );
  }

  return(
    <ItSocksContext.Provider value ={{
      ...itSocksState,
      setProducts: setProducts
    }} >
      { children }
    </ItSocksContext.Provider>
  )
}