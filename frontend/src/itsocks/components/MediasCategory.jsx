import React, { useContext } from 'react';

import { ProductoCard } from './ProductoCard';

// STILOS
import styles from '../../ui/styles/Medias.module.css';
// import { ItSocksContext } from '../context/ItSocksContext';
import { categorias } from '../data/categorias';
import { CategoriaCard } from './CategoriaCard';


export const MediasCategory = ({ category }) => {

  return (
    <div 
      className={
         `${styles.cards_container} ${styles.categories_container}` 
      }
    >
      {
          categorias.map( categoria => (
            <CategoriaCard
              key={ categoria.id }
              { ...categoria }
            />
          ))
        }
    </div>
  )
}
