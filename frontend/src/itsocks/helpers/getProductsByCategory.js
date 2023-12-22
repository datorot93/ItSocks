import { fetchWithoutToken } from "../../utils/api";

const LIMIT_QUERY = 30;

export const getProductsByCategory = async( category, skip ) => {
    // console.log('ESTA ES LA URL')
    // console.log(`products/accesorios?category=${category}&skip=${skip}&limit=${LIMIT_QUERY}`)
    const resp = await fetchWithoutToken(
        `products/accesorios?category=${category}&skip=${skip}&limit=${LIMIT_QUERY}`
    )
    const data = await resp.json();

    return data
}

// getProductsByCategoryDesign
export const getProductsByCategoryDesign = async( category, design, skip ) => {
    // console.log('ESTA ES LA URL CON DISENIO')
    // console.log(`products/accesorios/design?category=${category}&design=${design}&skip=${skip}&limit=${LIMIT_QUERY}`)
    const resp = await fetchWithoutToken(
        `products/accesorios/design?category=${category}&design=${design}&skip=${skip}&limit=${LIMIT_QUERY}`
        // `products/accesorios/design?category=${category}&design=${design}&skip=${skip}&limit=${LIMIT_QUERY}`
    )
    const data = await resp.json();

    // console.log('ESTA ES LA DATA DE ACCESORIOS DISEÑO')
    // console.log(data)

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

export const getProductsByCatSubcatTypeDesign = async( category, subcategory, type, design, skip ) => {
    // console.log(skip, limit)
    // console.log(`products/q/products_categories_types?category=${category}&subcategory=${subcategory}&type=${type}&skip=${skip}&limit=60`)
    const resp = await fetchWithoutToken(
        `products/q/products_categories_types_designs?category=${category}&subcategory=${subcategory}&type=${type}&design=${design}&skip=${skip}&limit=${LIMIT_QUERY}`
        // `products/q/products_categories_types_designs?category=medias&subcategory=estampadas&type=largas&design=animales&skip=0&limit=100`
    )
    const data = await resp.json();

    console.log('ESTA ES LA DATA')
    console.log(data)
    return data
}

export const getProductExtraInfo = async( name ) => {
    const resp = await fetchWithoutToken(`products/q/colors_tallas/${name}`)
    const data = await resp.json();
 
    return data
}