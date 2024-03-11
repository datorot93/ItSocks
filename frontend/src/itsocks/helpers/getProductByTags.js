import { fetchWithoutToken } from '../../utils/api';
import { productos } from '../data/productos';


const LIMIT_QUERY = 30;
export const getProductsByTags = async( tag, skip ) => {

    // console.log('ESTA ES LA URL')
    // console.log(`products/tag_products?tag=${tag}&skip=${skip}&limit=${LIMIT_QUERY}`)
    const resp = await fetchWithoutToken(
        // `products/accesorios/design?category=${category}&design=${design}&skip=${skip}&limit=${LIMIT_QUERY}`
        `products/tag_products?tag=${tag}&skip=${skip}&limit=${LIMIT_QUERY}`
    )
    const data = await resp.json();

    return data

    // return productos.filter( producto => producto.tags.includes(tag) );
}

export const getProductsByTagsType = async( tag, type, skip ) => {
    
    // console.log('ESTA ES LA URL')
    // console.log(`products/tag_products?tag=${tag}&skip=${skip}&limit=${LIMIT_QUERY}`)
    const resp = await fetchWithoutToken(
        // `products/accesorios/design?category=${category}&design=${design}&skip=${skip}&limit=${LIMIT_QUERY}`
        `products/tag_products_types?tag=${tag}&type=${type}&skip=${skip}&limit=${LIMIT_QUERY}`
    )
    const data = await resp.json();

    return data
}

export const getProductsByTagsSubcategory = async( tag, subcategory, skip ) => {

    // console.log('ESTA ES LA URL')
    // console.log(`products/tag_products?tag=${tag}&skip=${skip}&limit=${LIMIT_QUERY}`)
    const resp = await fetchWithoutToken(
        // `products/accesorios/design?category=${category}&design=${design}&skip=${skip}&limit=${LIMIT_QUERY}`
        `products/tag_products_subcategories?tag=${tag}&subcategory=${subcategory}&skip=${skip}&limit=${LIMIT_QUERY}`
    )
    const data = await resp.json();

    return data
}


export const getProductsByTagsSubcategoryCompresion = async( tag, subcategory, compresion_filter, skip ) => {

    let obj_compresion = {
        'medias_sin_compresion': false,
        'medias_de_compresion': true
    }

    const resp = await fetchWithoutToken(
        // `products/tag_products_subcategories?tag=${tag}&subcategory=${subcategory}&skip=${skip}&limit=${LIMIT_QUERY}`
        `products/tag_products_subcategory_compresion?tag=${tag}&subcategory=${subcategory}&compresion=${obj_compresion[compresion_filter]}&skip=${skip}&limit=${LIMIT_QUERY}`
    )
    const data = await resp.json();
    console.log('ESTA ES LA DATA')
    console.log(data)
    return data
}


export const getProductsByTagsTypeCompresion = async( tag, type, compresion_filter, skip ) => {
    
    let obj_compresion = {
        'medias_sin_compresion': false,
        'medias_de_compresion': true
    }
    console.log(`products/tag_products_types_compresion?tag=${tag}&type=${type}&compresion=${obj_compresion[compresion_filter]}&skip=${skip}&limit=${LIMIT_QUERY}`)
    const resp = await fetchWithoutToken(
        `products/tag_products_types_compresion?tag=${tag}&type=${type}&compresion=${obj_compresion[compresion_filter]}&skip=${skip}&limit=${LIMIT_QUERY}`
    )
    const data = await resp.json();
    console.log('ESTA ES LA DATA')
    console.log(data)
    return data
}