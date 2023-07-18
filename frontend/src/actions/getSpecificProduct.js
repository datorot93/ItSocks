
import { getProductsByCategory } from "../itsocks/helpers/getProductsByCategory";
import { types } from "../types/types";


// const [stations, setStations] = useState([]);


export const getSpecificProduct = ( product ) => {
    return async ( dispatch ) => {

        dispatch({ type: types.startLoadingSpecificProduct });

    
        dispatch({
            type: types.loadSpecificProduct,
            payload: product
        })    
    }
};