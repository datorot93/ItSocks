import { fetchWithoutToken } from '../../utils/api';
import { productos } from '../data/productos';

export const getProductsByTags = async( tag, skip ) => {
    const LIMIT_QUERY = 30;
    console.log('ESTA ES LA URL')
    console.log(`products/tag_products?tag=${tag}&skip=${skip}&limit=${LIMIT_QUERY}`)
    const resp = await fetchWithoutToken(
        // `products/accesorios/design?category=${category}&design=${design}&skip=${skip}&limit=${LIMIT_QUERY}`
        `products/tag_products?tag=${tag}&skip=${skip}&limit=${LIMIT_QUERY}`
    )
    const data = await resp.json();

    return data

    // return productos.filter( producto => producto.tags.includes(tag) );
}