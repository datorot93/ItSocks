
import React, { createContext, useReducer } from 'react'
import { orderReducer, orderInitialState } from '../reducers/orderReducer'


export const useOrderReducer = () => {

  const [ state, dispatch ] = useReducer(orderReducer, orderInitialState)

  const addToOrder = product => dispatch({
    type: 'ADD_TO_ORDER',
    payload: product
  })

  const createOrder = order => dispatch({
    type: 'CREATE_ORDER',
    payload: order
  })

  const addOneToOrder = product => dispatch({
    type: 'ADD_ONE_TO_ORDER',
    payload: product
  })

  const substrackProductFromOrder = product => dispatch({
    type: 'SUBSTRACT_PRODUCT_FROM_ORDER',
    payload: product
  })

  const subtractOneToOrder = product => dispatch({
    type: 'SUBTRACT_ONE_TO_ORDER',
    payload: product
  })

  const removeFromOrder = product => dispatch({
    type: 'REMOVE_FROM_ORDER',
    payload: product
  })

  const clearOrder = () => dispatch({
    type: 'CLEAR_ORDER',
  })

  const updateOrder = () => dispatch({
    type: 'UPDATE_ORDER',
  })

  return { state, addToOrder, removeFromOrder, addOneToOrder, subtractOneToOrder, substrackProductFromOrder, clearOrder, createOrder, updateOrder}
}