import { productos } from '../data/productos';

export const getProductsByTags = ( tag ) => {

    return productos.filter( producto => producto.tags.includes(tag) );
}