import React, { useState } from 'react'

// Styles
import styles from '../../ui/styles/Billing.module.css'

// Icons
import { Link } from 'react-router-dom'

// DATA
import { countries } from '../data/lista_paises'
import { departamentos } from '../data/lista_departamentos'

export const BillingInfoForm = () => {

    const [ direccion, setDireccion ] = useState('')

    const handleDireccion = (e) => {        
        setDireccion(e.target.value)
    }

    // HANDLE COUNTRY
    const [selectedCountry, setSelectedCountry] = useState('Colombia')
    const handleCountryChange = (event) => {
        setSelectedCountry(event.target.value)
    };

    // HANDLE REGION
    const [selectedRegion, setSelectedRegion] = useState('')
    const handleRegionChange = (event) => {
        const selectedRegionValue = event.target.value; // Almacenamos el valor seleccionado en una variable temporal
        setSelectedRegion(selectedRegionValue); // Actualizamos el estado con el valor seleccionado
    
        // Actualizamos las ciudades según la región seleccionada
        if (departamentos[selectedRegionValue]) {
            setCities(departamentos[selectedRegionValue]);
        } else {
            setCities([]);
        }
    };

    // HANDLE CITY
    const [cities, setCities ] = useState([])
    const [selectedCity, setSelectedCity] = useState('')
    const handleCityChange = (event) => {
        setSelectedCity(event.target.value)
      };
    

  return (
    <section className={ styles.billing_form }>
        <h3>Información de contacto facturación</h3>
        <form>

            <div className={ styles.form_field_personal }>                
                <input type="text" placeholder="Nombre" required/>
                <input type="text" placeholder="Apellido" required/>
            </div>

            <div className={ styles.form_field }>                
                <select value={ selectedCountry } onChange={ handleCountryChange } disabled={true}>
                {
                    countries.map( country => (
                            <option value={ country } key={ country }>{ country }</option>
                        ))
                    }
                </select>
            </div>

            <div className={ styles.form_field }>                
                <input type="text" placeholder="Dirección" required/>
            </div>

            <div className={ styles.form_field }>                
                <input type="text" placeholder="Apartamento, local, etc. (opcional)" required/>
            </div>

            <div className={ styles.form_field_personal }>                
                <select value={ selectedRegion } onChange={ handleRegionChange }>
                    <option value="">Provincia</option>
                        {
                            Object.keys( departamentos ).map( departamento => (
                            <option value={ departamento } key={ departamento }>{ departamento }</option>
                            ))
                        }
                </select>
                <select value={ selectedCity } onChange={ handleCityChange }>
                    <option value="">Ciudad</option>
                    {
                        cities.map( ciudad => (
                            <option value={ ciudad } key={ ciudad }>{ ciudad }</option>
                        ))
                    }
                </select>
                <input type="text" placeholder="Código postal" required/>
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
                    to="/carrito/billing/finish_order" 
                    
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
