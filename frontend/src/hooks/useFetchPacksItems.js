import { useEffect, useState } from "react";

import React from 'react'


import { 
    getProductsByCatType, 
    getProductsByCatTypeDesign,
  } from '../itsocks/helpers/getProductsByCategory';


export const useFetchPackItems = ( skip_page, setSkip, location, categoria, type ) => {

    

    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    
    const design = location.split("/")[3] ? location.split("/")[3].replace('%20', ' ').toLowerCase() : null;



    useEffect(() => {
        setLoading(true);

        if(location.split("/").length === 3 && location.split("/")[1].toLowerCase() === 'packs'){
            getProductsByCatType( 
            categoria,
            type, 
            skip_page
            ).then(
                res => {          
                    return setProducts( products => [...products, ...res] )
                }
            ).finally(() => setLoading(false));
        } else {
            getProductsByCatTypeDesign( 
                categoria,
                type,
                design,
                skip_page
            ).then( 
                res => {            
                return setProducts( products => [...products, ...res] )
                }
            ).finally(() => setLoading(false));
        }
        
    }, [skip_page])

    useEffect(() => {
        setProducts([]);
        setSkip(0);
      }, [location]);

      return {products, loading}
}   
