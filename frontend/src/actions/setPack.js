
import { getProductsByCategory } from "../itsocks/helpers/getProductsByCategory";
import { types } from "../types/types";


// const [stations, setStations] = useState([]);


export const getProductsList = ( category, subcategory = null, type = null ) => {

    return async ( dispatch ) => {

        dispatch( { type: types.startLoadingProducts } );

        const products = await getProductsByCategory( category );
        
        if (subcategory && type) {
            const filtered_products = products.filter( product => product.subcategory === subcategory && product.type === type)
            dispatch({
                type: types.loadProducts,
                payload: filtered_products
            })
        }else {
            dispatch({
                type: types.loadProducts,
                payload: products
            })    
        }
    }
}