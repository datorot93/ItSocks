//REACT
import React, { useEffect, useRef } from 'react';

// ACTIONS
import { getProductsListByType } from '../../actions/getProductsList';

//UTILITIES
import { types } from '../../types/types';

//REACT-REDUX
import { useDispatch, useSelector } from 'react-redux';

import { ProductoList } from '../components/ProductoList';

import styles from '../../ui/styles/Accesorios.module.css';
import { ProductFilter } from '../components/ProductFilter';
import { PackProductoList } from '../components/packs/PackProductList';


export const PacksProducts = ({ categoria, type }) => {
    // console.log(type);

    const mounted = useRef( true );
    const dispatch = useDispatch();

    useEffect( () => {
        if( mounted ){
            dispatch( getProductsListByType( categoria, type ));
        }

        return ( () => {
            mounted.current = false;
            dispatch({
            type: types.unmountProducts
            })
        })
    }, []);

    const products = useSelector( state => state.product.products )
    
    return (
    <>
        <div className={ styles.main }>
        <div className={ styles.container }>
            <div className={ styles.trancking_container }>
            <h1>{ categoria?.toUpperCase() } </h1>
            </div>
            <PackProductoList products = { products } />
            <ProductFilter categoria={ categoria } type={ type }/>          
        </div>
        </div>
    </>
    )
}
