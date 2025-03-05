import React, { useContext } from 'react';

import { ProductoCard } from './ProductoCard';

// STILOS
import styles from '../../ui/styles/Medias.module.css';
// import { ItSocksContext } from '../context/ItSocksContext';
import { categorias } from '../data/categorias';
import { CategoriaCard } from './CategoriaCard';
import { useEffect } from 'react';
import { getSubcategories } from '../helpers/getSubcategories';
import { useState } from 'react';


export const MediasCategory = () => {

  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    getSubcategories().then( data => {
      const filteredData = data.filter(
        categoria => "image_url" in categoria
      );
      setSubcategories(filteredData);
    }).catch( error => {
      console.log(error);
    })
  }, [])

  return (
    <div 
      className={
         `${styles.cards_container} ${styles.categories_container}` 
      }
    >
      {
          subcategories.map( categoria => (
            
            <CategoriaCard
              key={ categoria.id }
              { ...categoria }
            />
          ))
        }
    </div>
  )
}
