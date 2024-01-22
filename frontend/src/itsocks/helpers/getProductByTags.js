import { fetchWithoutToken } from '../../utils/api';
import { productos } from '../data/productos';

export const getProductsByTags = async( tag, skip ) => {
    const LIMIT_QUERY = 30;
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
    const LIMIT_QUERY = 30;
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
    const LIMIT_QUERY = 30;
    // console.log('ESTA ES LA URL')
    // console.log(`products/tag_products?tag=${tag}&skip=${skip}&limit=${LIMIT_QUERY}`)
    const resp = await fetchWithoutToken(
        // `products/accesorios/design?category=${category}&design=${design}&skip=${skip}&limit=${LIMIT_QUERY}`
        `products/tag_products_subcategories?tag=${tag}&subcategory=${subcategory}&skip=${skip}&limit=${LIMIT_QUERY}`
    )
    const data = await resp.json();

    return data
}