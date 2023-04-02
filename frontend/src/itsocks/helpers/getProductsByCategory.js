import { productos } from '../data/productos';

export const getProductsByCategory = ( categoria ) => {

  return productos.filter( producto => producto.categoria == categoria );

}