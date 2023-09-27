import React, { useState } from 'react'

// Styles
import styles from '../../ui/styles/Billing.module.css'

// Icons
import arrow_left_circle from '../../../public/assets/carrito/ArrowCircleLeft.svg'
import { Link } from 'react-router-dom'

export const BillingForm = () => {

    const [ direccion, setDireccion ] = useState('')

    const handleDireccion = (e) => {        
        setDireccion(e.target.value)
    }

  return (
    <section className={ styles.billing_form }>
        <h3>Información de contacto facturación</h3>
        <form>
            <div className={ styles.form_field }>                
                <input type="text" placeholder="Correo Electrónico" required/>
            </div>

            <div className={ styles.form_field_personal }>                
                <input type="text" placeholder="Nombre" required/>
                <input type="text" placeholder="Apellido" required/>
            </div>

            <div className={ styles.form_field }>                
                <input type="text" placeholder="Documento de identidad" required/>
            </div>

            <div className={ styles.form_field }>                
                <input type="text" placeholder="Teléfono" required/>
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
                <div className={ styles.seguir_comprando}>
                    <span className={ styles.left_arrow }>{'<'} </span>
                    <span>Seguir comprando</span>
                </div>

                {/* <input type="submit" className={ styles.continuar_confirmacion} value="Continuar con confirmación" /> */}
                <Link
                    to={direccion === "La misma dirección de envío" 
                    ? "finish_order" 
                    : "billing_info"}
                >
                    <button className={ styles.continuar_confirmacion} value="Continuar con confirmación">Continuar con confirmación</button>
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
