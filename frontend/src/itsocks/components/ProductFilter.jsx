import React, { useContext, useEffect, useRef, useState } from 'react';

// React Reouter DOM
import { useNavigate } from 'react-router-dom';


import styles from '../../ui/styles/Accesorios.module.css';
import { ItSocksContext } from '../context/ItSocksContext';
import { getProductsBySubCategory } from '../helpers/getProductsBySubCategory';

export const ProductFilter = ({ subcategoria = null }) => {
  
  const navigate = useNavigate();

  const initialState = [ 
    {
      subcategory: 'Viceras',
      checked: false
    }, 
    {
      subcategory: 'Termos',
      checked: false
    }, 
    {
      subcategory: 'Pines',
      checked: false
    }
  ]

  const initialState2 = {
    viceras: false,
    termos: false,
    pines: false
  }

  const [ checkedItems, setCheckedItems ] = useState( initialState2 );

  const handleChecked = async (e, subcategory ) => {    

    // const newState = checkedItems;
    // console.log(subcategory);
    // console.log(newState[subcategory])
    // newState[subcategory] = !newState[subcategory];
    const newState = checkedItems.map( item => {
      if( item[subcategory] === subcategory){
        return { ...item, checked: !item.checked}
      }else{
        return { ...item, checked: false}
      }
    })

    // const newState = {...checkedItems, checkedItems[subcategory]: !checkedItems[subcategory]}

    
    setCheckedItems([...newState]);

    // console.log("New State");
    // console.log(newState);
    // console.log("Checked Items");
    // console.log(checkedItems);
    // console.log(e.target.value.toLowerCase());
    if ( !checkedItems.some( element => element === true )){
      navigate('/accesorios');
    }else{
      navigate(`/accesorios/${ e.target.value.toLowerCase()}`)
    }
  }

  useEffect( () => {
    
  }, [checkedItems]);

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
                  checked={ checkedItems.subcategoria }
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
