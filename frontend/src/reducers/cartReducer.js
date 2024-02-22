import { usePack } from "../hooks/usePack"

export const cartInitialState = JSON.parse(window.localStorage.getItem('cart')) || []

export const CART_ACTION_TYPES = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  ADD_ONE_TO_CART: 'ADD_ONE_TO_CART',
  SUBTRACT_ONE_TO_CART: 'SUBTRACT_ONE_TO_CART',
  CLEAR_CART: 'CLEAR_CART'
}

// update localStorage with state for cart
export const updateLocalStorage = state => {
  window.localStorage.setItem('cart', JSON.stringify(state))
}

const UPDATE_STATE_BY_ACTION = {

  [CART_ACTION_TYPES.ADD_TO_CART]: (state, action) => {
    const { id, name, selected_size, selected_color, type } = action.payload;

    const productExists = state.some(
      item => item.name === name && item.id === id && item.selected_size == selected_size && item.selected_color == selected_color && item.type === type
    );

    let newState;

    if (productExists) {
      newState = state.map(item => 
        item.name === name && item.id === id && item.selected_size == selected_size && item.selected_color == selected_color && item.type === type
        ? { ...item, cantidad: item.cantidad + action.payload.cantidad }
        : item
      );
    } else {
      newState = [...state, { ...action.payload }];
    }

    updateLocalStorage(newState);
    return newState;
  },

  [CART_ACTION_TYPES.ADD_ONE_TO_CART]: (state, action) => {
    const { id } = action.payload
    const productInCartIndex = state.findIndex(item => item.id === id)

    if (productInCartIndex >= 0) {
      const newState = [
        ...state.slice(0, productInCartIndex),
        { ...state[productInCartIndex], cantidad: state[productInCartIndex].cantidad + 1 },
        ...state.slice(productInCartIndex + 1)
      ]
      
      updateLocalStorage(newState)
      return newState
    }

    const newState = [
      ...state,
      {
        ...action.payload, // product
        quantity: 1
      }
    ]

    updateLocalStorage(newState)
    return newState
  },
  
  [CART_ACTION_TYPES.SUBTRACT_ONE_TO_CART]: (state, action) => {
    console.log(action.payload)
    const { id, name, selected_color, selected_size } = action.payload
    const productInCartIndex = state.findIndex(
      item => item.name === name && item.id === id && item.selected_size == selected_size && item.selected_color == selected_color
    )

    if (productInCartIndex !== -1) {
      if ( state[productInCartIndex].cantidad > 1){
        const newState = [
          ...state.slice(0, productInCartIndex),
          { ...state[productInCartIndex], cantidad: state[productInCartIndex].cantidad - 1 },
          ...state.slice(productInCartIndex + 1)
        ]
        updateLocalStorage(newState)
        return newState
      } 
    }
    return state
  },

  [CART_ACTION_TYPES.REMOVE_FROM_CART]: (state, action) => {

    const { id, name, subcategory, type, price, selected_color, selected_size } = action.payload

    const prod_a_eliminar = state.filter(
      item => item.name === name && item.id === id && item.selected_size === selected_size && item.selected_color === selected_color && item.type === type && item.subcategory === subcategory
    )

    const newState = state.filter(
      item => item !== prod_a_eliminar[0]
    )

    updateLocalStorage(newState)
    return newState
  },

  [CART_ACTION_TYPES.CLEAR_CART]: () => {
    updateLocalStorage([])
    return []
  }
}

export const cartReducer = (state, action) => {
  const { type: actionType } = action
  const updateState = UPDATE_STATE_BY_ACTION[actionType]
  return updateState ? updateState(state, action) : state
}
