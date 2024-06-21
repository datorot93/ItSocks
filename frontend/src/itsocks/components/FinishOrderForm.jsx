import React, { useEffect, useRef, useState } from 'react'

// STYLES
import styles from '../../ui/styles/Billing.module.css'

//IMAGES
import metodo_pago from '../../../public/assets/pago/metodo_pago.jpg'
import pencil_edit from '../../../public/assets/pago/pencil_edit.svg'
import tooltip_icon from '../../../public/assets/pago/tootip_icon.svg'
import itsocks_logo from '../../../public/assets/navbar/itsocks_logo.png';
import fase_2 from '../../../public/assets/pago/2_fase.png'

// REACT ROUTER DOM
import { Link, useNavigate } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'

// MERCADOPAGO
// import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// HELPERS
import { getPreference } from '../helpers/getPreference'
import { useShipping } from '../../hooks/useShipping'
import { useDiscount } from '../../hooks/useDiscount'
import { usePreference } from '../../hooks/usePreference'




export const FinishOrderForm = () => {

    const {shipping} = useShipping()

    const {preference} = usePreference()
    console.log(preference.response)
    
    const [ currentAddess, setCurrentAddress ] = useState(shipping.address)
    const [ currentEmail, setCurrentEmail ] = useState(shipping.email)
    const emailInput = useRef(null)
    const addressInput = useRef(null)

    const { removeFromDiscount } = useDiscount()

    const [showTooltip, setShowTooltip] = useState(false)

    const handleClickEmail = () => {
        emailInput.current.focus()
        emailInput.current.select()
    }

    const handleClickAddress = () => {
        addressInput.current.focus()
        addressInput.current.select()

    }

    initMercadoPago('APP_USR-fdd1f5ed-5de6-4b53-bf09-28c53ff9827a', {
        locale: 'es-CO'
    });

    const initialization = {
        preferenceId: preference.response.id,
      }

    console.log(preference.response.id)

    const customization = {
        texts: {
         valueProp: 'smart_option',
        },
      }

    const navigate = useNavigate();

    const handleEmail = (e) => {
        setCurrentEmail(e.target.value)
    }

    const handleDireccion = (e) => {
        setCurrentAddress(e.target.value)
    }

    const handleVolverInformacion = () => {
        removeFromDiscount()
        navigate("/carrito/billing")
    }
    

    const tooltipComponent = <div className={ styles.tooltip }>
        <p>En este correo recibirás la información del estado de tu pedido</p>
    </div>

  return (
    <section className={ styles.billing_form }>
        <div className={ styles.billing_header }>
            <img src={ itsocks_logo } alt="Logo de Itsocks"/>
            <img src={ fase_2 } alt="Logo de Itsocks"/>
        </div>
        <h3>Información</h3>
        <form>
            <div className={ styles.informacion_container }>
                
            <div className={ styles.field_with_tootip}>

                <div className={ styles.form_field_finish_order }>
                    <div className={ styles.header_contacto}>
                        
                        <label>Contacto:</label>
                        <div 
                            className={ styles.tooltip_container }
                            onMouseEnter={ () => setShowTooltip(true) }
                            onMouseLeave={ () => setShowTooltip(false)}
                        >
                            {
                                showTooltip ?
                                <>{tooltipComponent}</>
                                :<></>
                            }
                            <img src={ tooltip_icon } alt="Editar"/>
                        </div>
                    </div>
                    <div className={ styles.informacion_envio }>
                        <input 
                            type="text" 
                            placeholder="Correo Electrónico"
                            value={ currentEmail }
                            onChange={ handleEmail}
                            ref={ emailInput }
                            required
                        />

                        <img onClick={ handleClickEmail } src={ pencil_edit } alt="Editar"/>

                    </div>
                </div>

                
            </div>
                <div className={ styles.field_with_tootip}>
                    <div className={ styles.form_field_finish_order }>
                        <label>Enviar a:</label>
                        <div className={ styles.informacion_envio}>
                            <input 
                                type="text" 
                                placeholder="Dirección de envío"
                                value={ currentAddess }
                                onChange={ handleDireccion }
                                ref={ addressInput }
                                required
                            />

                                <img onClick={ handleClickAddress } src={ pencil_edit } alt="Editar"/>
                                

                        </div>
                    </div>
                    
                </div>
            </div>

            

            <div className={ styles.billing_opciones }>
                <h3>Envíos</h3>
            
                <div className={ styles.opciones_envio }>
                    <div className={ styles.opciones_envio_check}>
                        <p>Envío</p>
                    </div>
                    {
                        shipping.shipping_value > 0 ?
                        <p><strong>{ shipping.shipping_value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</strong></p>
                        :<p><strong>Envío Gratis</strong></p>
                    }
                    
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
                <div className={ styles.seguir_comprando} onClick={ handleVolverInformacion }>
                    <span className={ styles.left_arrow }>{'<'} </span>
                    <span>Volver a información</span>
                </div>

                {
                    Object.keys(preference).length > 0 ?
                    <div id="wallet_container">
                        {/* <Wallet 
                            initialization={initialization}
                            customization={customization}
                            onSubmit={() => console.log('Submit')}
                            onReady={() => console.log('Ready')}
                            onError={(error) => console.log('Error', error)}
                        /> */}
                        <a
                            href={ preference.response.init_point }
                            className={ styles.pagar_mercadopago}
                            // className={ styles.pagar_mercadopago }
                        >Pagar con Mercado Pago</a>
                    </div>
                    :<></>
                }
            </div>
        </form>

        <div className={ styles.billing_footer}>
            <hr />
            <div className={ styles.footer_links }>
                <Link
                    to='/mas/envios_garantias_cambios'
                >
                    <p>Envios, Garantías y Cambios</p>
                </Link>
            </div>
        </div>
    </section>
  )
}
