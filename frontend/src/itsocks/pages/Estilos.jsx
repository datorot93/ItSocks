import React, { useEffect, useState } from 'react'
import { getProductsByTags } from '../helpers/getProductByTags';
import { ProductoList2 } from '../components/ProductoList2';
import { ProductFilter } from '../components/ProductFilter';

import styles from '../../ui/styles/Accesorios.module.css';
import { TagFilter } from '../components/TagFilter';


import filters_icon from "../../assets/navbar/filters_icon.svg";


export const Estilos = ({ estilo, filtro }) => {
  // const productos = getProductsByTags( estilo );

  const [showFilters, setShowFilters] = useState(false);
  
  const handleButtonFilters = () => {
    setShowFilters(!showFilters);
  }


  return (
    <>
      <div className={ styles.main }>
        <div className={ styles.container }>
          <div className={ styles.trancking_container }>
            <h1>{estilo.toUpperCase()}</h1>
          </div>
          <div className={ styles.filters_button_container} onClick={ handleButtonFilters }>
            <img src={ filters_icon } alt="icono filtros" />
            <p>Filtros</p>
          </div>
          <TagFilter 
            estilo={estilo} 
            filtro={filtro}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
          <ProductoList2 estilo={estilo} filtro={filtro}/>
        </div>
      </div>
    </>
  )
}
