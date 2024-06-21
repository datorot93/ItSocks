
export const preferenceInitialState = JSON.parse(window.localStorage.getItem('preference')) || []

export const PREFERENCE_ACTION_TYPES = {
  ADD_TO_PREFERENCE: 'ADD_TO_PREFERENCE',
  REMOVE_FROM_PREFERENCE: 'REMOVE_FROM_PREFERENCE'
}

// update localStorage with state for preference
export const updateLocalStorage = state => {
  window.localStorage.setItem('preference', JSON.stringify(state))
}

const UPDATE_STATE_BY_ACTION = {

  // ADD PREFERENCE
  [PREFERENCE_ACTION_TYPES.ADD_TO_PREFERENCE]: (state, action) => {

    let newState = { ...action.payload };
    updateLocalStorage(newState);

    return newState;
  },

  // REMOVE PREFERENCE
  [PREFERENCE_ACTION_TYPES.REMOVE_FROM_PREFERENCE]: () => {

    let newState = {};

    updateLocalStorage(newState)
    return newState
  }
}

export const preferenceReducer = (state, action) => {
  const { type: actionType } = action
  const updateState = UPDATE_STATE_BY_ACTION[actionType]
  return updateState ? updateState(state, action) : state
}
