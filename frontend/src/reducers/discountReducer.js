
export const discountInitialState = JSON.parse(window.localStorage.getItem('discount')) || null

export const DISCOUNT_ACTION_TYPES = {
  ADD_TO_DISCOUNT: 'ADD_TO_DISCOUNT',
  REMOVE_FROM_DISCOUNT: 'REMOVE_FROM_DISCOUNT'
}

// update localStorage with state for discount
export const updateLocalStorage = state => {
  window.localStorage.setItem('discount', JSON.stringify(state))
}

const UPDATE_STATE_BY_ACTION = {

  [DISCOUNT_ACTION_TYPES.ADD_TO_DISCOUNT]: (state, action) => {
    const newState = action.payload;

    updateLocalStorage(newState);
    return newState;
  },

  [DISCOUNT_ACTION_TYPES.REMOVE_FROM_DISCOUNT]: (state, action) => {

    const newState = null

    updateLocalStorage(newState)
    return newState
  },

  [DISCOUNT_ACTION_TYPES.CLEAR_DISCOUNT]: () => {
    updateLocalStorage(null)
    return null
  }
}

export const discountReducer = (state, action) => {
  const { type: actionType } = action
  const updateState = UPDATE_STATE_BY_ACTION[actionType]
  return updateState ? updateState(state, action) : state
}
