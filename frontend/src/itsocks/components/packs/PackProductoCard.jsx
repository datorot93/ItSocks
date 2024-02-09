import React from 'react'

import { Link, useLocation } from 'react-router-dom'

// Utilidades
import { LazyLoadImage } from 'react-lazy-load-image-component'

import styles from '../../../ui/styles/Accesorios.module.css'
import { getSpecificProduct } from '../../../actions/getSpecificProduct'
import { useDispatch } from 'react-redux'



export const PackProductoCard = ( product ) => {

    const {pathname} = useLocation();
    const compresion = product.compresion ? 'medias_de_compresion' : 'medias_sin_compresion';

    let ruta = "";

    if (pathname.split("/").length === 3){
        ruta = `${product.design.toLowerCase()}/${compresion}/${product.name.toLowerCase()}`
    } else if (pathname.split("/").length === 4){
        ruta = `${compresion}/${product.name.toLowerCase()}`
    } else if (pathname.split("/").length === 5){
        ruta = product.name.toLowerCase();
    }

    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch( getSpecificProduct( product ));

        const current_product = JSON.stringify(product);
        const packs =JSON.stringify({ ...product, 'prductos': []})
        localStorage.setItem('current_product', current_product)        
    };

    return (

    <div className={ `${styles.card} animate__animated animate__fadeIn` }>
        <Link
            to={ 
                ruta
            }
            onClick={ handleClick }
        >
            <LazyLoadImage src={ product.images.image1 } alt= { product.name } />
            <div className={ styles.product_info }>
                <p><strong>{ product.name } { product.color != 'N/A' ? product.color : ''}</strong></p>
            </div>
        </Link>
        
    </div>

    )
}
