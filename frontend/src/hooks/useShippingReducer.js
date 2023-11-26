import React, { createContext, useReducer } from 'react'
import { shippingReducer, shippingInitialState } from '../reducers/shippingReducer'


export const useShippingReducer = () => {
  const [ state, dispatch ] = useReducer(shippingReducer, shippingInitialState)
  // console.log(state)
  const addShipping = shipping => dispatch({
    type: 'ADD_SHIPPING',
    payload: shipping
  })

  const modifyShipping = shipping => dispatch({
    type: 'MODIFY_SHIPPING',
    payload: shipping
  })

  return { state, addShipping, modifyShipping}
}