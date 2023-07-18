import React, { useEffect, useState } from 'react';

// React Reouter DOM
import { useNavigate } from 'react-router-dom';

//UTILITIES
import { types } from '../../types/types';

import styles from '../../ui/styles/Accesorios.module.css';
import { useDispatch } from 'react-redux';
import { getProductsFilteredBySubcategory } from '../../actions/getProductsFilteredBySubcategory';


const initialState2 = {
  viceras: false,
  termos: false,
  pines: false
};

export const ProductFilter = ({ subcategoria = null }) => {


  const [ checkedItems, setCheckedItems ] = useState( initialState2 );

  const dispatch = useDispatch();

  let subcategory = null;

  for (let clave in checkedItems) {
    if (checkedItems[clave] === true) {
      subcategory = clave;
      break;
    }
  };
  // useEffect( () => {
  //   getProductsFilteredBySubcategory( subcategory );

  // }, []);
  // useEffect( () => {
  //   dispatch( getProductsFilteredBySubcategory( subcategory ));
  //   return ( () => {
  //     dispatch({
  //       type: types.unmountProducts
  //     })
  //   })
  // }, [checkedItems]);



  const handleChecked = async (e, subcategory ) => {    

    setCheckedItems( (prevState) => {
      const updatedItems = {};
      Object.keys(prevState).forEach((key) => {
        updatedItems[key] = key === subcategory ? !prevState[key] : false;
      });
      return updatedItems;
    });

  };

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
