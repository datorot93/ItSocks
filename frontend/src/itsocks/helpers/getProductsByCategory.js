import { fetchWithoutToken } from "../../utils/api";

const LIMIT_QUERY = 30;

export const getProductsByCategory = async( category, skip ) => {
    
    const resp = await fetchWithoutToken(
        `products/accesorios?category=${category}&skip=${skip}&limit=${LIMIT_QUERY}`
    )
    const data = await resp.json();

    return data
}

export const getProductcsByCatSubcat = async( category, subcategory, skip) => {
    const resp = await fetchWithoutToken(
        `products/q/products_categories?category=${category}&subcategory=${subcategory}&skip=${skip}&limit=${LIMIT_QUERY}`
    )
    
    const data = await resp.json();

    return data
}

export const getProductsFilters = async( category, subcategory, type ) => {
    const resp = await fetchWithoutToken(
        `products/q/products_designs?category=${category}&subcategory=${subcategory}&type=${type}`
    )

    const data = await resp.json();

    return data
}

export const getFiltersAccesorios = async( category ) => {
    const resp = await fetchWithoutToken(
        `products/q/accesorios_designs?category=${category}`
    )

    const data = await resp.json();

    return data

}

export const getProductsByCatSubcatType = async( category, subcategory, type, skip ) => {
    // console.log(skip, limit)
    // console.log(`products/q/products_categories_types?category=${category}&subcategory=${subcategory}&type=${type}&skip=${skip}&limit=60`)
    const resp = await fetchWithoutToken(
        `products/q/products_categories_types?category=${category}&subcategory=${subcategory}&type=${type}&skip=${skip}&limit=${LIMIT_QUERY}`
    )
    const data = await resp.json();
    return data
}

export const getProductExtraInfo = async( name ) => {
    const resp = await fetchWithoutToken(`products/q/colors_tallas/${name}`)
    const data = await resp.json();
 
    return data
}