import React, { useEffect, useRef } from 'react'

// ACTIONS
import { getProductsList } from '../../actions/getProductsList';

// REACT REDUX
import { useDispatch, useSelector } from 'react-redux'

// ESTILOS
import styles from '../../ui/styles/Accesorios.module.css'

import { ProductFilter } from '../components/ProductFilter';
import { ListaPacks } from '../components/packs/ListaPacks';
import { FilterPacks } from '../components/packs/FilterPacks';


export const Packs = () => {
  const mounted = useRef( true );
  const dispatch = useDispatch();

  



  return (
    <>
    
      <div className={ styles.main }>
        <div className={ styles.container }>
          <div className={ styles.trancking_container }>
            <h1>{ 'PACKS' } </h1>
          </div>
          <ListaPacks />
          <FilterPacks />          
        </div>
      </div>
    </>
  )
}
