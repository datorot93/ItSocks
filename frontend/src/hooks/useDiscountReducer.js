import React, { createContext, useReducer } from 'react'
import { discountReducer, discountInitialState } from '../reducers/discountReducer'

export const useDiscountReducer = () => {

  const [ state, dispatch ] = useReducer(discountReducer, discountInitialState)
  
  const addToDiscount = product => dispatch({
    type: 'ADD_TO_DISCOUNT',
    payload: product
  })

  const removeFromDiscount = product => dispatch({
    type: 'REMOVE_FROM_DISCOUNT',
    payload: product
  })

  return { state, addToDiscount, removeFromDiscount }
}