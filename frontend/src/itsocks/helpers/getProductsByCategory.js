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
        `products/product_by_design?design=${design}&skip=0&limit=30`
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
    // console.log(data)
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

export const getTagTypeCompresionFilters = async( tag, type ) => {
    const resp = await fetchWithoutToken(
        `products/q/compresion_filters_tag_type/${tag}/${type}`
    )

    const data = await resp.json();

    return data
}

export const getTagSubcategoryCompresionFilters = async( tag, subcategory ) => {
    const resp = await fetchWithoutToken(
        `products/q/compresion_filters_tag_subcategory/${tag}/${subcategory}`
    )

    const data = await resp.json();

    return data
}

export const getCompresionFilters = async(
    category,
    subcategory,
    type,
    design
) => {

    const resp = await fetchWithoutToken(
        `products/q/compresion_filters/${category}/${subcategory}/${type}/${design}`
    )

    const data = await resp.json();
    return data

}

export const getPackCompresionFilters = async(
    type,
    design
) => {
    const resp = await fetchWithoutToken(
        `products/q/pack_compresion_filters/medias/${type}/${design}`
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
    // console.log('ESTOY EN EL FRILTRO DISENIO')
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

export const getProductsByCatSubcatTypeDesignCompresion = async( category, subcategory, type, design, compresion, skip ) => {
    let obj_compresion = {
        'medias_sin_compresion': false,
        'medias_de_compresion': true
    }

    // console.log(`products/q/products_categories_subcat_types_designs_compresion?category=${category}&subcategory=${subcategory}&type=${type}&design=${design}&compresion=${obj_compresion[compresion]}&skip=${skip}&limit=${LIMIT_QUERY}`)
    const resp = await fetchWithoutToken(
        `products/q/products_categories_subcat_types_designs_compresion?category=${category}&subcategory=${subcategory}&type=${type}&design=${design}&compresion=${obj_compresion[compresion]}&skip=${skip}&limit=${LIMIT_QUERY}`
    )
    const data = await resp.json();
    return data
}

export const getProductsByCatTypeDesignCompresion = async( category, type, design, compresion, skip ) => {
    let obj_compresion = {
        'medias_sin_compresion': false,
        'medias_de_compresion': true
    }
    console.log(`products/q/products_categories_types_designs_compresion?category=${category}&type=${type}&design=${design}&compresion=${obj_compresion[compresion]}&skip=${skip}&limit=${LIMIT_QUERY}`)
    const resp = await fetchWithoutToken(
        `products/q/products_categories_types_designs_compresion?category=${category}&type=${type}&design=${design}&compresion=${obj_compresion[compresion]}&skip=${skip}&limit=${LIMIT_QUERY}`
    )
    const data = await resp.json();
    return data
}

export const getProductExtraInfo = async( name, type ) => {
    const resp = await fetchWithoutToken(`products/q/colors_tallas/${name}/${type}`)
    const data = await resp.json();
    
    // console.log('ESTA ES LA DATA')
    // console.log(data[0].size)
    return data
}


