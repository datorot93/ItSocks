import { useEffect, useState } from "react";

import React from 'react'


import { 
    getProductsByCatSubcatType, 
    getProductsByCategory, 
    getProductsByCatSubcatTypeDesign,
    getProductsByCategoryDesign
  } from '../itsocks/helpers/getProductsByCategory';
import { useDispatch } from "react-redux";


export const useFetchItems = ( skip_page, setSkip, location, design, categoria, subcategoria, type ) => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const dispatch = useDispatch();
    

    useEffect(() => {
        setLoading(true);
    
        if(categoria && subcategoria && type){
          if(location.split("/").length != 5 && location.split("/")[1].toLowerCase() !== 'accesorios'){
            getProductsByCatSubcatType( 
              categoria, 
              subcategoria, 
              type, 
              skip_page
            ).then( 
              res => {
                return setProducts( products => [...products, ...res] )
              }
            ).finally(
              () => setLoading(false),
              // dispatch({type: 'SET_LOADING', payload: false}),
            );
          } else {
            getProductsByCatSubcatTypeDesign( 
              categoria, 
              subcategoria, 
              type,
              design.replace('%20', ' '),
              skip_page
            ).then( 
              res => {            
                return setProducts( products => [...products, ...res] )
              }
            ).finally(() => setLoading(false));
          }
        } else{
          if(location.split("/").length == 2 && location.split("/")[1].toLowerCase() === 'accesorios'){
            // console.log('Entré al if de accesorios')
            getProductsByCategory( 
              categoria,
              skip_page
            ).then( 
              res => (          
                setProducts( products => [...products, ...res] )
              )
            ).finally(() => setLoading(false));
          }else if (location.split("/").length === 3) {
            // console.log('Entré al otro if de accesorios')
            const disenio = location.split("/")[2].replace('%20', ' ').toLowerCase();
            getProductsByCategoryDesign(
              categoria,
              disenio,
              skip_page
            ).then( 
              res => {            
                return setProducts( products => [...products, ...res] )
              }
            ).finally(() => setLoading(false));
          }
        }
    }, [skip_page])

    useEffect(() => {
        setProducts([]);
        setSkip(0);
      }, [location]);

      
      return {products, loading}
}   
