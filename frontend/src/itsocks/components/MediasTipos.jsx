import React, { useContext } from 'react';

import { ProductoCard } from './ProductoCard';

// STILOS
import styles from '../../ui/styles/Medias.module.css';
// import { ItSocksContext } from '../context/ItSocksContext';
import { tipos } from '../data/tipos';
import { CategoriaCard } from './CategoriaCard';


export const MediasTipos= ({ category }) => {

  return (
    <div className={ styles.categories_container }>
      {
          tipos.map( categoria => (
            <CategoriaCard
              key={ categoria.id }
              { ...categoria }
            />
          ))
        }
    </div>
  )
}
