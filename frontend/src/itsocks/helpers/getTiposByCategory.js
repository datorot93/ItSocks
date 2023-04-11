import { tipos } from '../data/tipos';

export const getSubcategoriesByCategory = ( categoria ) => {

  return tipos.filter( tipo => tipo.categoria == categoria );

}