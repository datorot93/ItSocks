import { types } from '../types/types';

export const itSocksReducer = ( state = [], action ) => {


  switch (action.type ) {
    case types.setProducts:
      return {
        ...state,
        loaded: true,
        productos: action.payload
      }
  }
}
