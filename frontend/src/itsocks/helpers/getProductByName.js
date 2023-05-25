import { productos } from '../data/productos';

export const getProductsByName = ( nombre ) => {

  return productos.filter( producto => producto.nombre == nombre );

}