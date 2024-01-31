import { types } from '../types/types';


const initialState = {
    products: [],
    isLoading: false,
}

export const productReducer = ( state = initialState, action ) => {

    switch( action.type ) {
        case types.startLoadingProducts:
            return{
                ...state,
                isLoading: true
            }
        case types.loadProducts:
            console.log(action.payload)
            state.products = [ ...state['products'], ...action.payload]
            return {
                ...state,
                isLoading: false,
            }
        case types.unmountProducts:
            return {
                ...state,
                products: [],
                isLoading: true
            }
        
        case types.startLoadingSpecificProduct:
            return {
                ...state,
                isLoading: true
            }
        case types.loadSpecificProduct:
            return {
                ...state,
                products: [action.payload],
                isLoading: false
            }
        default:
            return state
    }
}