import React, { createContext, useReducer } from 'react'
import { cartReducer, cartInitialState } from '../reducers/cartReducer'

export const useCartReducer = () => {

  const [ state, dispatch ] = useReducer(cartReducer, cartInitialState)
  
  const addToCart = product => dispatch({
    type: 'ADD_TO_CART',
    payload: product
  })

  const addPackToCart = product => dispatch({
    type: 'ADD_PACK_TO_CART',
    payload: product
  })

  const addOneToCart = product => dispatch({
    type: 'ADD_ONE_TO_CART',
    payload: product
  })

  const subtractOneToCart = product => dispatch({
    type: 'SUBTRACT_ONE_TO_CART',
    payload: product
  })

  const removeFromCart = product => dispatch({
    type: 'REMOVE_FROM_CART',
    payload: product
  })

  return { state, addToCart, addPackToCart, removeFromCart, addOneToCart, subtractOneToCart}
}