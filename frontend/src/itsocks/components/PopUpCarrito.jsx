import React, { useState } from 'react'

// Estilos
import styles from '../../ui/styles/PopUpCarrito.module.css';
import camion from '../../../public/assets/producto/camion.svg';

export const PopUpCarrito = ({ title, product }) => {
    
    const [showComponent, setShowComponent] = useState(true);

    const handleCloseClick = () => {
        setShowComponent(false);
    };



    return (
        <>
        {
            showComponent && (
                <div className={ styles.container }>
                    
                    <div className= { styles.title } onClick={ handleCloseClick }>
                        <h1>{ title }</h1>
                        <span>X</span>
                    </div>

                    
                    <div className={ styles.product_container }>
                        <div className={ styles.product_image }>
                            <img src={ product.images[Object.keys(product.images)[0]]} alt="Imagen producto" />
                        </div>
                        <div className={ styles.product_description}>
                            <p> {product.name + ' ' + product.color }</p>
                            <div className={ styles.price }>
                                <p>{ '$ ' + product.price  }</p>
                            </div>
                        </div>
                    </div>

                    
                    <div className={ styles.costo_envio }>
                        <img src={ camion } alt="Ícono camion" />
                        <p>{'Lleva $ '}</p><strong>{ `${ 200000 - product.price }`}</strong> <p>{' más y el envio te sale gratis'}</p>
                    </div>

                    
                    <div className={ styles.subtotal }>
                        <h3>SUBTOTAL:</h3>
                        <p>{ `$ ${product.price}` }</p>
                    </div>

                    
                    <div className={ styles.info }>
                        <p>Gastos de envío y descuentos calculando al momento de pagar</p>
                    </div>

                    <div className={ styles.buttons}>
                        <button className={ styles.boton_comprar }>
                            COMPRAR AHORA
                        </button>
                        <button className={ styles.boton_ver_carrito }>
                            VER CARRITO
                        </button>
                    </div>
                </div>          
            )
        }
        </>
        
    )
};
