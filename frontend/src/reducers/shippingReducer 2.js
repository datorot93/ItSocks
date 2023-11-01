export const shippingInitialState = JSON.parse(window.localStorage.getItem('shipping')) || {}

export const SHIPPING_ACTION_TYPES = {
  ADD_SHIPPING: 'ADD_SHIPPING',
  MODIFY_SHIPPING: 'MODIFY_SHIPPING'
}

// update localStorage with state for cart
export const updateLocalStorage = state => {
  window.localStorage.setItem('shipping', JSON.stringify(state))
}

const UPDATE_STATE_BY_ACTION = {
  [SHIPPING_ACTION_TYPES.ADD_SHIPPING]: (state, action) => {
    const newState = { ...action.payload }
    updateLocalStorage(newState)
    return newState
  },

  [SHIPPING_ACTION_TYPES.MODIFY_SHIPPING]: (state, action) => {
    const newState = { ...action.payload }
    updateLocalStorage(newState)
    return newState
  }
}

export const shippingReducer = (state, action) => {
  const { type: actionType } = action
  const updateState = UPDATE_STATE_BY_ACTION[actionType]
  return updateState ? updateState(state, action) : state
}
