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
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// HELPERS
import { getPreference } from '../helpers/getPreference'
import { useShipping } from '../../hooks/useShipping'
import { useDiscount } from '../../hooks/useDiscount'
import { usePreference } from '../../hooks/usePreference'
import { setOrder, setProductOrder } from '../helpers/setOrder'
import { useCart } from '../../hooks/useCart'




export const FinishOrderForm = () => {

    const { shipping } = useShipping()
    const { cart, clearCart } = useCart()
    const {preference} = usePreference()

    
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


    // https://www.mercadopago.com.co/checkout/v1/payment/redirect/bcb3db22-1c08-41d5-ad73-135cc79e6cc9/fatal/?preference-id=1600827084-c9b35f77-bbc4-4792-8862-7ef349b42c75&router-request-id=f571fc8f-adc7-4051-9019-245a4116b8cf&p=6c8b6c024d956c83aab8b0351d1e6edd

    initMercadoPago('APP_USR-394df966-9b8b-442a-9c5c-71f6923d3ad0', {
        locale: 'es-CO'
    });
    // initMercadoPago('APP_USR-fdd1f5ed-5de6-4b53-bf09-28c53ff9827a', {
    //     locale: 'es-CO'
    // });

    // const initialization = {
    //     preferenceId: preference.response.id,
    //   }

    console.log(preference)

    // const customization = {
    //     texts: {
    //      valueProp: 'smart_option',
    //     },
    //   }

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

    // console.log(cart)

    const handleOrder = () => {
        // const resp = setWishList(lista_wish).then( data => {
        //     console.log(data)
        //   })
        console.log('Entré')
        const order = setOrder({
            "first_name": shipping.first_name,
            "last_name": shipping.last_name,
            "address": shipping.address,
            "phone_number": shipping.phone,
            "billing_addess": shipping.billingAddress,
            "region": shipping.region,
            "country": shipping.country,
            "city": shipping.city,
            "document": shipping.document,
            "email": shipping.email,
            "extra_info": shipping.extra_information,
            "special_instructions": shipping.special_instructions,
            "de": shipping.from,
            "para": shipping.to,
            "isGift": shipping.isGift,
            "state": "No preparado",
            "quantity": shipping.products_quantity,
            "shipping_cost": shipping.shipping_value,
            "total": shipping.total,
            "subtotal": shipping.subtotal,
            "shipping_guide": "No asignada",
            "shipping_guide_url": "",
            "preference": preference.response.id
        }).then(
            data => {
                // console.log('Este es el data: ', data)
                const promises = [];
                
                cart.forEach((product, index) => {
                    if (product.name.toLowerCase().includes('pares')) {
                        product.prductos.forEach(prod => {
                            console.log('Este es el producto: ', product);
                            const promise = setProductOrder({
                                product_id: prod.id,
                                order_id: data.id,
                                quantity: prod.cantidad,
                                pack: product.name,
                                size: prod.selected_size,
                                num_in_order: index + 1,
                                discount: prod.discount,
                                discount_code: '',
                                
                            }).then(res => {
                                // console.log('Este es el res1: ', res);
                            });
                            promises.push(promise);
                        });
                    } else {
                        const promise = setProductOrder({
                            product_id: product.id,
                            order_id: data.id,
                            quantity: product.cantidad,
                            pack: '',
                            size: product.selected_size,
                            num_in_order: index + 1,
                            discount: product.discount,
                            discount_code: product.discount_code,
                            price_paid: product.price - (product.price * product.discount / 100)
                        }).then(res => {
                            console.log('Este es el res2: ', res);
                        });
                        promises.push(promise);
                    }
                });
                
                Promise.all(promises)
                    .then(() => {
                        console.log('All products have been processed.');
                    })
                    .catch(error => {
                        console.error('An error occurred while processing products:', error);
                    });
            }
        )

        

        // clearCart()
        // navigate(preference.response.init_point, { replace: true })
        // window.location.href = preference.response.init_point;

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
                        <p><strong>{ shipping.shipping_value.toLocaleString(
                            'es-CO', 
                            { style: 'currency', currency: 'COP' }
                        ) }</strong></p>
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
                            onClick={ handleOrder }
                            // href={ preference.response.init_point }
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
