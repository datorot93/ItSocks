import React, { useEffect, useState } from 'react'

// Styles
import styles from '../../ui/styles/Billing.module.css'

// Icons
import itsocks_logo from '../../../public/assets/navbar/itsocks_logo.png';
import fase_1 from '../../../public/assets/pago/1_fase.png'

// Mercadopago
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useShipping } from '../../hooks/useShipping'
import { useDiscount } from '../../hooks/useDiscount';
import { usePreference } from '../../hooks/usePreference';
import { getPreference } from '../helpers/getPreference';

export const BillingForm = () => {

   

    const [ direccion, setDireccion ] = useState('')
    const [ preferenceLoading, setPreferenceLoading ] = useState(false)


    const {modifyShipping} = useShipping()
    const { addToPreference } = usePreference()
    const { removeFromDiscount } = useDiscount()

    // Fields
    const [ email, setEmail ] = useState('')
    const [ name, setName ] = useState('')
    const [ lastName, setLastName ] = useState('')
    const [ document, setDocument ] = useState('')
    const [ phone, setPhone ] = useState('')

    const handleDireccion = (e) => {        
        setDireccion(e.target.value)
    }

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const handleName = (e) => {
        setName(e.target.value)
    }

    const handleLastName = (e) => {
        setLastName(e.target.value)
    }

    const handleDocument = (e) => {
        setDocument(e.target.value)
    }

    const handlePhone = (e) => {
        setPhone(e.target.value)
    }

    const carrito = JSON.parse(localStorage.getItem('cart'))
    const {shipping} = useShipping()

    const handleClick = () => {
        
        setPreferenceLoading(true)

        let items_compra = []
        if(carrito){
            carrito.forEach(item => {
                items_compra.push({
                    id: item.id,
                    title: item.name,
                    code: item.code,
                    unit_price: item.price,
                    compresion: item.compresion,
                    quantity: item.cantidad,
                    description: item.description,
                    discount: item.discount,
                    category_discount: item.category_discount,
                    subcategory_discount: item.subcategory_discount,
                    category: item.category,
                    subcategory: item.subcategory,
                    type: item.type,
                    design: item.design,
                    images: item.images
                })
            });
        }
        const datos_compra = {
            items: [...items_compra, {title: 'Envío', unit_price: shipping.shipping_value, quantity: 1}],
        }
        
        getPreference(datos_compra).then( 
            res => {
                addToPreference(res)
                console.log(res)
            }
        ).catch(
            err => {
                console.log(err)
            }
        ).finally(
            setPreferenceLoading(false)
        )

        modifyShipping({
            email,
            name,
            lastName,
            document,
            phone,
            direccion
        })
    }

    const {pathname} = useLocation();
    const navigate = useNavigate();

    const handleVolverCarrito = () => {
        removeFromDiscount()
        navigate("/carrito", {state: {previousPath: pathname}})
    }

  return (
    <section className={ styles.billing_form }>
        <div className={ styles.billing_header }>
            <img src={ itsocks_logo } alt="Logo de Itsocks"/>
            <img src={ fase_1 } className={ styles.progress_image} alt="Logo de Itsocks"/>
        </div>
        <h3>Información de contacto facturación</h3>
        <form>
            <div className={ styles.form_field }>                
                <input 
                  type="text" 
                  placeholder="Correo Electrónico"
                  onChange={ handleEmail }
                  required/>
            </div>

            <div className={ styles.form_field_personal }>                
                <input 
                  type="text" 
                  placeholder="Nombre"
                  onChange={ handleName }
                  required
                />
                <input 
                  type="text" 
                  placeholder="Apellido"
                  onChange={ handleLastName }
                  required
                />
            </div>

            <div className={ styles.form_field }>                
                <input 
                  type="text" 
                  placeholder="Documento de identidad" 
                  onChange={ handleDocument }
                  required
                />
            </div>

            <div className={ styles.form_field }>                
                <input 
                  type="text" 
                  placeholder="Teléfono" 
                  onChange={ handlePhone }
                  required
                />
            </div>

            <div className={ styles.billing_opciones }>
                <h3>Dirección de facturación</h3>
                <div className={ styles.direcciones }>
                    <label className={ styles.custom_checkbox }>
                        <input 
                            type="radio" 
                            value='La misma dirección de envío' 
                            name='opciones_facturacion'
                            onChange={ handleDireccion }                         
                        /> 
                        <span className={ styles.checkmark}></span>
                    </label>
                    <p>La misma dirección de envío</p>
                </div>
                <div className={ styles.direcciones }>
                    <label className={ styles.custom_checkbox }>
                        <input 
                            type="radio" 
                            value='Usar una dirección de facturación distinta' 
                            name='opciones_facturacion'
                            onChange={ handleDireccion }
                        />
                        <span className={ styles.checkmark}></span>
                    </label>
                    <p>Usar una dirección de facturación distinta</p>
                </div>
            </div>

            <div className={ styles.optionals_characteristics }>
                    <div className={ styles.opcionales}>
                        <label className={ styles.custom_opctionals_checkbox }>
                            <input 
                                type="checkbox"
                                onChange={ () => console.log('Checkeado') }
                            />
                            <span className={ styles.optional_checkmark}></span>
                        </label>
                        
                        <p>Guardar mi información y consultar más rápidamente la próxima vez</p>
                    </div>
                
                    <div className={ styles.opcionales}>
                        <label className={ styles.custom_opctionals_checkbox }>
                            <input 
                                type="checkbox"                            
                                onChange={ () => console.log('Checkeado') }
                            />
                            <span className={ styles.optional_checkmark}></span>
                        </label>
                        <p>Enviarme novedades y ofertas por correo electrónico</p>
                    </div>

            </div>

            <div className={ styles.buttons }>
                <div className={ styles.seguir_comprando} onClick={ handleVolverCarrito }>
                    <span className={ styles.left_arrow }>{'<'} </span>
                    <span>Volver al carrito</span>
                </div>

                {/* <input type="submit" className={ styles.continuar_confirmacion} value="Continuar con confirmación" /> */}
                <Link
                    to={direccion === "La misma dirección de envío" 
                    ? "finish_order" 
                    : "billing_info"}
                    onClick={ handleClick }
                >
                    <button 
                        className={ styles.continuar_confirmacion} 
                        value="Continuar con confirmación"
                        onClick={ handleClick}
                    >Continuar con confirmación</button>
                </Link>
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
