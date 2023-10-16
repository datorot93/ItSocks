import React from 'react'

// Estilos
import styles from '../../ui/styles/PopUpCarrito.module.css';
import camion from '../../../public/assets/producto/camion.svg';

export const PopUpCarrito = ({ title, product }) => {
  return (
    
    <div className={ styles.container }>
        {/* TÍTULO */}
        <div className= { styles.title }>
            <h1>{ title }</h1>
            <span>X</span>
        </div>

        {/* PRODUCTO */}
        <div className={ styles.product_container }>
            <div className={ styles.product_image }>
                <img src={ product.images[Object.keys(product.images)[0]]} alt="Imagen producto" />
            </div>
            <div className={ styles.product_description}>
                <p> {product.name + '+' + product.color }</p>
                <div className={ styles.price }>
                    <p>{ '$ ' + product.price  }</p>
                </div>
            </div>
        </div>

        {/* COSTO ENVÍO */}
        <div className={ styles.costo_envio }>
            <img src={ camion } alt="Ícono camion" />
            <p>{'Lleva $ '}</p><strong>{ `${ 200000 - product.price }`}</strong> <p>{' más y el envio te sale gratis'}</p>
        </div>
    </div>          
  )
}
