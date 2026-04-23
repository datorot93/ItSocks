export const cartInitialState = JSON.parse(window.localStorage.getItem('cart')) || []

export const CART_ACTION_TYPES = {
  ADD_TO_CART: 'ADD_TO_CART',
  ADD_PACK_TO_CART: 'ADD_PACK_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  ADD_ONE_TO_CART: 'ADD_ONE_TO_CART',
  SUBTRACT_ONE_TO_CART: 'SUBTRACT_ONE_TO_CART',
  CLEAR_CART: 'CLEAR_CART',
  MODIFY_CART_PRODUCT: 'MODIFY_CART_PRODUCT'
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

  [CART_ACTION_TYPES.MODIFY_CART_PRODUCT]: (state, action) => {
    const { id, name, selected_size, selected_color, type } = action.payload;
    
    // console.log('Modificando producto:', action.payload); // Añadido para debug
    
    // Buscar el producto específico para modificar
    const productIndex = state.findIndex(
      item => item.name === name && 
      item.id === id && 
      item.selected_size === selected_size && 
      item.selected_color === selected_color && 
      item.type === type
    );
    
    if (productIndex >= 0) {
      // Crear una copia del estado actual
      const newState = [...state];
      // Reemplazar el producto con la versión actualizada
      newState[productIndex] = { ...action.payload };
      
      // console.log('Nuevo estado:', newState); // Para debug
      updateLocalStorage(newState);
      return newState;
    }
    
    // Si no encuentra el producto, retorna el estado sin cambios
    return state;
  },

  [CART_ACTION_TYPES.ADD_PACK_TO_CART]: (state, action) => {

    let newState = [...state, { ...action.payload }];
    // console.log('ESTE ES EL NUEVO ESTADO')
    // console.log(newState)
    updateLocalStorage(newState);
    return newState;
  },

  [CART_ACTION_TYPES.ADD_ONE_TO_CART]: (state, action) => {
    const { id, selected_size, selected_color, subcategory } = action.payload
    const productInCartIndex = state.findIndex(
      item => item.id === id && item.selected_size === selected_size && item.selected_color === selected_color && item.subcategory === subcategory
    )

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
    // console.log('ESTOY EN SUBTRACT_ONE_TO_CART')
    // console.log(action.payload)
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
