import React, { useEffect, useState } from 'react';

// React Reouter DOM
import { useNavigate } from 'react-router-dom';

//UTILITIES
import { filters } from '../data/filters'

import styles from '../../ui/styles/Accesorios.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { getProductsListByFilterSubcategory, getProductsListByTypeAndDesign } from '../../actions/getProductsList';


export const ProductFilter = ({ subcategoria = null, categoria, type = null }) => {
  
  const initialState2 = filters[categoria]


  const [ checkedItems, setCheckedItems ] = useState( initialState2 )
  const lista_productos = useSelector(state => state.product.products)
  
  const dispatch = useDispatch()

  let subcategory = null;

  for (let clave in checkedItems) {
    if (checkedItems[clave] === true) {
      subcategory = clave;
      break;
    }
  };


  const handleChecked = async (e, subcategory ) => {    

    setCheckedItems( (prevState) => {
      const updatedItems = {};
      Object.keys(prevState).forEach((key) => {
        updatedItems[key] = key === subcategory ? !prevState[key] : false;
      });
      return updatedItems;
    });
  };

  
  useEffect( () => {
    if (!subcategoria && !type ){
      dispatch( getProductsListByFilterSubcategory( categoria, checkedItems));
    }else if(!subcategoria && type) {
      dispatch( getProductsListByTypeAndDesign( checkedItems, categoria, type));
    }else {
      dispatch( getProductsListByFilterSubcategory( categoria, checkedItems, subcategoria, type) )
    }
  }, [checkedItems])


  return (
    <>
      <div className={ styles.product_filter }>
        {
          Object.getOwnPropertyNames(checkedItems).map( subcategory => (
              
              <label key={ subcategory }>                
                <input
                  key={ subcategory }
                  type="checkbox"                  
                  id={ subcategory }                
                  checked={ checkedItems[subcategory] }
                  value = { subcategory }
                  onChange={ event => handleChecked( event, subcategory ) }
                />
                { subcategory }
              </label>
              
            
          ))
        }
        
      </div>
    </>
  )
}
