import React, { useEffect, useState } from 'react';

// REACT-REDUX
import { useDispatch, useSelector } from 'react-redux';

// React Reouter DOM
import { useNavigate } from 'react-router-dom';

//UTILITIES
import { types } from '../../types/types';


import styles from '../../../ui/styles/Accesorios.module.css';

export const FilterPacks = () => {

//   const initialState2 = filters[categoria]
const initialState = {
    "PARES DE MEDIAS LARGAS X4": false,
    "PARES DE MEDIAS LARGAS X3": false,
    "PARES DE PANTORRILLERAS X4": false,
    "PARES DE PANTORRILLERAS X3": false,
    "PARES MEDIA CAÑA X4": false,
    "PARES MEDIA CAÑA X3": false
};


const [ checkedItems, setCheckedItems ] = useState( initialState )
const lista_productos = useSelector(state => state.product.products)


// console.log( armarEstadoInicial(lista_productos) )

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


//   useEffect( () => {
//     if (!subcategoria && !type ){
//       dispatch( getProductsListByFilterSubcategory( categoria, checkedItems));
//     }else {
//       dispatch( getProductsListByFilterSubcategory( categoria, checkedItems, subcategoria, type) )
//     }
//   }, [checkedItems])


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
