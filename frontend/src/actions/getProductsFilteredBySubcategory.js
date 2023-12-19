import { useDispatch, useSelector } from "react-redux";

// import { getProductsByCategory } from "../itsocks/helpers/getProductsByCategory";

import { types } from "../types/types";


// const [stations, setStations] = useState([]);


export const getProductsFilteredBySubcategory = ( subcategory ) => {

    const products = useSelector( state => state.product);
    const dispatch = useDispatch();

    if(subcategory){
        console.log(products);
        dispatch({
            type: types.loadProducts,
            payload: products
        }); 
    }
    return products
}