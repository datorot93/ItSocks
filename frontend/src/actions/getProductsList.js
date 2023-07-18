
import { getProductsByCategory } from "../itsocks/helpers/getProductsByCategory";
import { types } from "../types/types";


// const [stations, setStations] = useState([]);


export const getProductsList = ( category ) => {
    return async ( dispatch ) => {

        dispatch( { type: types.startLoadingProducts } );

        const products = await getProductsByCategory( category );
        // console.log('ESTOS SON LOS PRODUCTOS');
        // console.log(products);
    
        dispatch({
            type: types.loadProducts,
            payload: products
        })    
    }
}