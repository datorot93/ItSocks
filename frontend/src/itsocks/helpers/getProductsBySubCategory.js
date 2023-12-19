import { productos } from '../data/productos';

export const getProductsBySubCategory = ( categoria, subcategoria ) => {
  console.log('getProductsBySubCategory');
  console.log(subcategorias);
  console.log(productos.filter( producto => subcategorias.includes(producto.subcategoria)));
  if( subcategorias.length > 0 ){
    return productos.filter( producto => subcategorias.includes(producto.subcategoria) );
  }else {
    return productos.filter( producto => producto.categoria = categoria )
  }

  return productos.filter( producto => producto.categoria === categoria && producto.subcategoria === subcategoria );
}