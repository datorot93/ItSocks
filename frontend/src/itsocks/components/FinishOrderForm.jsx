import React, { useState } from 'react'

// STYLES
import styles from '../../ui/styles/Billing.module.css'

//IMAGES
import metodo_pago from '../../../public/assets/pago/metodo_pago.jpg'

// REACT ROUTER DOM
import { Link } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'



export const FinishOrderForm = () => {


    const [ direccion, setDireccion ] = useState('')

    const handleDireccion = (e) => {        
        setDireccion(e.target.value)
    }

  return (
    <section className={ styles.billing_form }>
        <h3>Información</h3>
        <form>
            <div className={ styles.form_field }>                
                <input type="text" placeholder="Correo Electrónico" required/>
            </div>

            <div className={ styles.form_field }>                
                <input type="text" placeholder="Dirección" required/>
            </div>

            

            <div className={ styles.billing_opciones }>
                <h3>Envíos</h3>
            
                <div className={ styles.opciones_envio }>
                    <div className={ styles.opciones_envio_check}>

                        <label className={ styles.custom_checkbox }>
                            <input 
                                type="radio" 
                                value='Envío gratis' 
                                name='opciones_facturacion'
                                onChange={ handleDireccion }                         
                            /> 
                            <span className={ styles.checkmark}></span>
                        </label>
                        <p>Envío gratis</p>
                    </div>
                    <p><strong>Gratis</strong></p>
                </div>
            
                
                <div className={ styles.opciones_envio }>
                    <div className={ styles.opciones_envio_check}>
                        <label className={ styles.custom_checkbox }>
                            <input 
                                type="radio" 
                                value='Bogotá y alrededores' 
                                name='opciones_facturacion'
                                onChange={ handleDireccion }
                            />
                            <span className={ styles.checkmark}></span>
                        </label>
                        <p>Bogotá y alrededores</p>
                    </div>             
                    <p><strong>{ '$ 5.600,00'.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</strong></p>
                </div>
                
            </div>

            <div className={ styles.metodo_pago }>
                <h4>Método de pago</h4>
                <div className={ styles.info_pago}>
                    <p>Todas las transacciones son seguras y están encriptadas</p>
                    <LazyLoadImage src={ metodo_pago } alt='Método de pago'/>
                </div>
            </div>

            <div className={ styles.buttons }>                
                <div className={ styles.seguir_comprando}>
                    <span className={ styles.left_arrow }>{'<'} </span>
                    <span>Seguir comprando</span>
                </div>

                {/* <input type="submit" className={ styles.continuar_confirmacion} value="Continuar con confirmación" /> */}
                <Link                    
                >
                    <button className={ styles.continuar_confirmacion} value="Continuar con confirmación">Continuar con el pago</button>
                </Link>
            </div>
        </form>

        <div className={ styles.billing_footer}>
            <hr />
            <div className={ styles.footer_links }>
                <Link>
                    <p>Política de reembolso</p>
                </Link>
                <Link>
                    <p>Política de envío</p>
                </Link>
                <Link>
                    <p>Política de Privacidad</p>
                </Link>
            </div>
        </div>
    </section>
  )
}
