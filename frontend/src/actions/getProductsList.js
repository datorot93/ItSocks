
import { getProductsByCategory } from "../itsocks/helpers/getProductsByCategory";
import { types } from "../types/types";


// const [stations, setStations] = useState([]);


export const getProductsList = ( category, subcategory = null, type = null ) => {


    // console.log( subcategory )

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

export const getProductsListByType = ( categoria, type ) => {

    return async ( dispatch ) => {

        dispatch( { type: types.startLoadingProducts } );

        const products = await getProductsByCategory( categoria );
        const filtered_products = products.filter( product => product.type === type)

        dispatch({
            type: types.loadProducts,
            payload: filtered_products
        })    
        
    }
}


export const getProductsListByFilterSubcategory = ( category, subcategories, subcategoria, type ) => {

    const lista_filtros_subcategory = []
    for (const key in subcategories ) {
        if (subcategories[key] === true){
            lista_filtros_subcategory.push(key)
        }
    }

    return async ( dispatch ) => {

        dispatch( { type: types.startLoadingProducts } );

        let lista_productos = []
        const products = await getProductsByCategory( category );
        if ( !subcategoria && !type ){            
            if ( lista_filtros_subcategory.length == 0){
                lista_productos = products
            }else{
                lista_productos = products.filter( product => lista_filtros_subcategory.includes(product.subcategory))
            }
        } else {
            const productos_base = products.filter( 
                product => product.subcategory === subcategoria && product.type === type 
            )

            if ( lista_filtros_subcategory.length == 0){
                lista_productos = productos_base
            }else{
                lista_productos = productos_base.filter( product => lista_filtros_subcategory.includes(product.design))
            }
        }
        // const lista_productos = products.filter( product => product.subcategory.includes(subcategory))
    
        dispatch({
            type: types.loadProducts,
            payload: lista_productos
        })
    }
}

export const getProductsListByTypeAndDesign = ( subcategories, category, type ) => {

    const lista_filtros_subcategory = []
    for (const key in subcategories ) {
        if (subcategories[key] === true){
            lista_filtros_subcategory.push(key)
        }
    }

    return async ( dispatch ) => {

        dispatch( { type: types.startLoadingProducts } );
        let lista_productos = []

        const products = await getProductsByCategory( category );
        const filtered_products = products.filter( product => product.type === type)

        if ( lista_filtros_subcategory.length == 0){
            lista_productos = filtered_products
        }else{
            lista_productos = filtered_products.filter( product => lista_filtros_subcategory.includes(product.design))
        }
        
        // const lista_productos = products.filter( product => product.subcategory.includes(subcategory))
    
        dispatch({
            type: types.loadProducts,
            payload: lista_productos
        })
    }
}