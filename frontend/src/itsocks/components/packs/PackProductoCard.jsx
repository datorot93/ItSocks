import React from 'react'

import { Link, useLocation } from 'react-router-dom'

// Utilidades
import { LazyLoadImage } from 'react-lazy-load-image-component'

import styles from '../../../ui/styles/Accesorios.module.css'
import { getSpecificProduct } from '../../../actions/getSpecificProduct'
import { useDispatch } from 'react-redux'



export const PackProductoCard = ( product ) => {

    const location = useLocation().pathname;

    const ruta = location.split('/').length === 3 ? 
        `${product.design.toLowerCase()}/${product.name.toLowerCase()}`
        : product.name.toLowerCase();

    

    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch( getSpecificProduct( product ));

        const current_product = JSON.stringify(product);
        const packs =JSON.stringify({ ...product, 'prductos': []})

        localStorage.setItem('current_product', current_product)        
    };

    return (

    <div className={ styles.card }>
        
        <Link
            to={ 
                ruta
            }
            onClick={ handleClick }
        >
            <LazyLoadImage src={ product.images.image1 } alt= { product.name } />
            <div className={ styles.product_info }>
                <p>{ product.name } { product.color != 'N/A' ? product.color : ''}</p>
                
            </div>
        </Link>
        
    </div>

    )
}
