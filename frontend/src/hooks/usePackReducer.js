
import React, { createContext, useReducer } from 'react'
import { packReducer, packInitialState } from '../reducers/packReducer'


export const usePackReducer = () => {

  const [ state, dispatch ] = useReducer(packReducer, packInitialState)

  const addToPack = product => dispatch({
    type: 'ADD_TO_PACK',
    payload: product
  })

  const createPack = pack => dispatch({
    type: 'CREATE_PACK',
    payload: pack
  })

  const addOneToPack = product => dispatch({
    type: 'ADD_ONE_TO_PACk',
    payload: product
  })

  const substrackProductFromPack = product => dispatch({
    type: 'SUBSTRACT_PRODUCT_FROM_PACK',
    payload: product
  })

  const subtractOneToPack = product => dispatch({
    type: 'SUBTRACT_ONE_TO_PACk',
    payload: product
  })

  const removeFromPack = product => dispatch({
    type: 'REMOVE_FROM_PACk',
    payload: product
  })

  const clearPack = () => dispatch({
    type: 'CLEAR_PACK',
  })

  const updatePack = () => dispatch({
    type: 'UPDATE_PACK',
  })

  return { state, addToPack, removeFromPack, addOneToPack, subtractOneToPack, substrackProductFromPack, clearPack, createPack, updatePack}
}