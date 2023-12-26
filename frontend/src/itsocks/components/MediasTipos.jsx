import React, { useContext } from 'react';

import { ProductoCard } from './ProductoCard';

// STILOS
import styles from '../../ui/styles/Medias.module.css';
// import { ItSocksContext } from '../context/ItSocksContext';
import { tipos } from '../data/tipos';
import { CategoriaCard } from './CategoriaCard';


export const MediasTipos= ({ subcategory }) => {

  const tipos_subcategory = tipos.filter( tipo => tipo.subcategoria == subcategory);

  return (
    <div className={ styles.categories_container }>
      {
          tipos_subcategory.map( categoria => (
            <CategoriaCard
              key={ categoria.id }
              { ...categoria }
            />
          ))
        }
    </div>
  )
}
