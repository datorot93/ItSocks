import React, { useEffect, useState } from 'react'

// Styles
import styles from '../../ui/styles/Billing.module.css'

// Icons
import itsocks_logo from '../../../public/assets/navbar/itsocks_logo.png';
import fase_1 from '../../../public/assets/pago/1_fase.png'

import { Link, useNavigate } from 'react-router-dom'

// DATA
import { countries } from '../data/lista_paises'
import { departamentos } from '../data/lista_departamentos'
import { useShipping } from '../../hooks/useShipping'
import { getCiudadesPorDepartamento, getDepartamentos } from '../helpers/getShippingInfo'

export const BillingInfoForm = () => {

    const [ direccion, setDireccion ] = useState('')
    const [ extraInformation, setExtraInformation ] = useState('')
    const [selectedCountry, setSelectedCountry] = useState('Colombia')
    const { shipping, modifyShipping } = useShipping()
    const [departamentos, setDepartamentos] = useState([])
    const [cities, setCities ] = useState([])
    const [selectedCity, setSelectedCity] = useState('')
    const [selectedRegion, setSelectedRegion] = useState('')


    useEffect(() => {
        getDepartamentos().then(
            (res) => setDepartamentos(res.departamentos)
        ).catch(
            (err) => console.log(err)
        )
    }, [selectedCountry])



    useEffect(() => {
        if(selectedCountry === "Colombia") {
            getCiudadesPorDepartamento( selectedRegion ).then(
            (res) => setCities(res.municipio_ciudad)
            ).catch(
            (err) => console.log(err)
            )
        }
    }, [selectedRegion])
    const handleDireccion = (e) => {        
        setDireccion(e.target.value)
    }
    const navigate = useNavigate()
    // HANDLE COUNTRY
    const handleCountryChange = (event) => {
        setSelectedCountry(event.target.value)
    };

    // HANDLE REGION
    
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
    
    const handleCityChange = (event) => {
        setSelectedCity(event.target.value)
      };

    const handleExtraInformation = (e) => {
        setExtraInformation(e.target.value)
    }

    const handleContinuarConfirmacion = () => {
        modifyShipping({
            billingAddress: direccion,
            region: selectedRegion,
            city: selectedCity,
            extra_information: extraInformation
        })
    }
    

  return (
    <section className={ styles.billing_form }>

        <div className={ styles.billing_header }>
            <img src={ itsocks_logo } alt="Logo de Itsocks"/>
            <img src={ fase_1 } alt="Logo de Itsocks"/>
        </div>
        <h3>Información de contacto facturación</h3>
        <form>



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
                <input 
                    type="text" 
                    placeholder="Dirección"
                    onChange={ handleDireccion }
                    required
                />
            </div>

            <div className={ styles.form_field }>                
                <input 
                    type="text" 
                    placeholder="Apartamento, local, etc. (opcional)"
                    onChange={ handleExtraInformation }
                    required
                />
            </div>

            <div className={ styles.form_field_personal }>                
                <select value={ selectedRegion } onChange={ handleRegionChange }>
                    <option value="" placeholder=''>Seleccione Departamento</option>
                        {
                            departamentos.map( departamento => (
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

            <div 
                className={ styles.buttons }
            >
                <div 
                    className={ styles.seguir_comprando}
                    onClick={ () => navigate('/carrito')}
                >
                    <span className={ styles.left_arrow }>{'<'} </span>
                    <span>Volver al carrito</span>
                </div>

                {/* <input type="submit" className={ styles.continuar_confirmacion} value="Continuar con confirmación" /> */}
                <Link
                    to="/carrito/billing/finish_order"
                    onClick={ handleContinuarConfirmacion }
                    
                >
                    <button className={ styles.continuar_confirmacion} value="Continuar con confirmación">Continuar con confirmación</button>
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

