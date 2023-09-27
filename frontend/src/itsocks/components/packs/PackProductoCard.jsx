import React from 'react'

import { Link } from 'react-router-dom'

// Utilidades
import { LazyLoadImage } from 'react-lazy-load-image-component'

import styles from '../../../ui/styles/Accesorios.module.css'
import { getSpecificProduct } from '../../../actions/getSpecificProduct'
import { useDispatch } from 'react-redux'



export const PackProductoCard = ( product ) => {

    const ruta = `/${product.category}/${ product.subcategory == "estampadas" ? "estampadas/pantorrillera/" : ""}${product.name}`

    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch( getSpecificProduct( product ));
        const current_product = JSON.stringify(product);

        localStorage.setItem('current_product', current_product);
    };

    return (

    <div className={ styles.card }>
        
        {/* <img src={ 	`${ ruta_imagenes }/${ nombre }.jpg` } alt= { nomSbre } /> */}
        <Link
            to={ 
                product.name
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
