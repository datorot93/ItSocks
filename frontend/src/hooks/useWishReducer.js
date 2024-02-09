import React, { createContext, useReducer } from 'react'
import { wishReducer, wishInitialState } from '../reducers/wishReducer'

export const useWishReducer = () => {

  const [ state, dispatch ] = useReducer(wishReducer, wishInitialState)
  
  const addToWish = product => dispatch({
    type: 'ADD_TO_WISH',
    payload: product
  })

  const addOneToWish = product => dispatch({
    type: 'ADD_ONE_TO_WISH',
    payload: product
  })

  const subtractOneToWish = product => dispatch({
    type: 'SUBTRACT_ONE_TO_WISH',
    payload: product
  })

  const removeFromWish = product => dispatch({
    type: 'REMOVE_FROM_WISH',
    payload: product
  })

  return { state, addToWish, removeFromWish, addOneToWish, subtractOneToWish}
}