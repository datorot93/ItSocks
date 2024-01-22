import { categorias } from '../data/categorias';

export const getSubcategoriesByCategory = ( categoria ) => {

  return categorias.filter( category => category.categoria == categoria );

}