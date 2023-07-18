import { productos } from '../data/productos';

export const getProductsByPartOfName = ( nombre ) => {

  return productos.filter( 
        producto => producto.nombre.toLowerCase().startsWith(nombre.toLowerCase().split(' ')[0]) 
        && producto.nombre != nombre
    );

}