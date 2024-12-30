import React, { useContext } from 'react';

import { ProductoCard } from './ProductoCard';

// STILOS
import styles from '../../ui/styles/Medias.module.css';
// import { ItSocksContext } from '../context/ItSocksContext';
import { tipos } from '../data/tipos';
import { CategoriaCard } from './CategoriaCard';
import { getTypes } from '../helpers/getSubcategories';
import { useState } from 'react';
import { useEffect } from 'react';


export const MediasTipos= ({ subcategory }) => {


  console.log(subcategory)
  const [tipos, setTipos] = useState([]);

  useEffect(() => {
    getTypes().then( data => {
      const filteredData = data.filter(
        tipo => tipo.subcategory == subcategory
      );
      setTipos(filteredData);
    }).catch( error => {
      console.log(error);
    })
  }, [])


  return (
    <div 
      className={ 
        `${styles.cards_container} ${ tipos.length == 3 ? styles.categories_container : styles.types_container}`
      }
    >
      {
          tipos.map( tipo => (
            <CategoriaCard
              key={ tipo.id }
              { ...tipo }
            />
          ))
        }
    </div>
  )
}
