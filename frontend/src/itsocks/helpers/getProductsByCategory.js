import { fetchWithoutToken } from "../../utils/api";

const LIMIT_QUERY = 30;

export const getProductsByCategory = async( category, skip ) => {
    const resp = await fetchWithoutToken(
        `products/accesorios?category=${category}&skip=${skip}&limit=${LIMIT_QUERY}`
    )
    const data = await resp.json();

    return data
}

// getProductsByCategoryDesign
export const getProductsByCategoryDesign = async( category, design, skip ) => {

    const resp = await fetchWithoutToken(
        `products/accesorios/design?category=${category}&design=${design}&skip=${skip}&limit=${LIMIT_QUERY}`
    )
    const data = await resp.json();

    return data
}

export const getProductsByDesign = async( design ) => {

    const resp = await fetchWithoutToken(
        `products/product_by_design?design=${design}&skip=0&limit=60`
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

export const getTagSubcategoryFilters = async( tag ) => {
    const resp = await fetchWithoutToken(
        `products/q/subcategories_by_tag?tag=${tag}`
    )

    const data = await resp.json();

    return data
}

export const getTagTypeFilters = async( tag ) => {
    const resp = await fetchWithoutToken(
        `products/q/types_by_tag?tag=${tag}`
    )

    const data = await resp.json();

    return data

}

export const getPackProductsFilters = async( category, type ) => {
    const resp = await fetchWithoutToken(
        `products/q/packs_designs?category=${category}&type=${type}`
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
    
    const resp = await fetchWithoutToken(
        `products/q/products_categories_subcat_types?category=${category}&subcategory=${subcategory}&type=${type}&skip=${skip}&limit=${LIMIT_QUERY}`
    )
    const data = await resp.json();
    return data
}

export const getProductsByCatSubcatTypeDesign = async( category, subcategory, type, design, skip ) => {
    
    const resp = await fetchWithoutToken(
        `products/q/products_categories_subcat_types_designs?category=${category}&subcategory=${subcategory}&type=${type}&design=${design}&skip=${skip}&limit=${LIMIT_QUERY}`
    )
    const data = await resp.json();

    return data
}

export const getProductsByCatType = async( category, type, skip ) => {
    
    const resp = await fetchWithoutToken(
        `products/q/products_categories_types?category=${category}&type=${type}&skip=${skip}&limit=${LIMIT_QUERY}`
    )
    const data = await resp.json();
    return data
}

export const getProductsByCatTypeDesign = async( category, type, design, skip ) => {
    
    const resp = await fetchWithoutToken(
        `products/q/products_categories_types_design?category=${category}&type=${type}&design=${design}&skip=${skip}&limit=${LIMIT_QUERY}`
    )
    const data = await resp.json();
    return data
}

export const getProductExtraInfo = async( name, type ) => {
    const resp = await fetchWithoutToken(`products/q/colors_tallas/${name}/${type}`)
    const data = await resp.json();
 
    return data
}