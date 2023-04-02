import React, { useContext, useEffect, useRef, useState } from 'react';

import styles from '../../ui/styles/Accesorios.module.css';
import { ItSocksContext } from '../context/ItSocksContext';
import { getProductsBySubCategory } from '../helpers/getProductsBySubCategory';

export const ProductFilter = () => {

  const { setProducts } = useContext( ItSocksContext );
  const [ subcategorie, setSubcategorie ] = useState( [] );

  const reference = useRef()

  const subcategorias = [ 
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
  ];





  useEffect( () => {
    // setSubcategorie(oldArray => [...subcategorie, e.target.value.toLowerCase()]);    handleChecked()
  }, [subcategorie]);


  const handleChecked = async (e) => {    
    
    if(e.target.checked){

      setSubcategorie(oldArray => [...subcategorie, e.target.value.toLowerCase()]);
      
    }else{
      
      setSubcategorie(oldArray => subcategorie.filter( item => item !== e.target.value.toLowerCase()))
    }

    reference.current = subcategorie;
    console.log(reference.current);


    // let productos = getProductsBySubCategory( "accesorios", subcategorie );
    // setProducts( productos );
    
      
    // // setProducts(subcategorie);

  }



  return (
    <>
      <div className={ styles.product_filter }>
        {
          subcategorias.map( ({subcategory, checked}, index) => (
              <label key={ subcategory }>                
                <input 
                  type="checkbox"                  
                  id={ subcategory }                
                  checked= { checked }
                  value = { subcategory }
                  onChange={ handleChecked }
                />
                { subcategory }
              </label>
              
            
          ))
        }
        
      </div>


    </>
  )
}
