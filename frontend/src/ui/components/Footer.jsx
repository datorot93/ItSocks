import React from 'react';

import { Link } from 'react-router-dom';

import styles from './../styles/Footer.module.css';

import itsocks_logo from '../../assets/navbar/itsocks_logo.png';
import icono_facebook from '../../assets/footer/icono_facebook.svg';
import icono_instagram from '../../assets/footer/icono_instagram.svg';
import icono_tiktok from '../../assets/footer/icono_tiktok.svg';

export const Footer = () => {
  return (
    <footer className={ styles.main }>
        <div className={ styles.container }>
            <div className={ styles.links_container}>
                <a
                   href={`https://api.whatsapp.com/send?phone=573143939837&text=Hola!%20Cordial%20saludo,%20estoy%20interesad@%20en%20comprar%20productos%20IT%20SOCKS,%20me%20podrías%20dar%20más%20información%2E%20Gracias`}
                   target='_blank'
                >Contáctanos</a>
                <Link 
                    to='/mas/envios_garantias_cambios'
                >Envíos, Garantías y Devoluciones</Link>
                <Link
                    to='/politicas_proteccion_datos'
                >Plíticas de protección de datos</Link> |
                <div className={ styles.icons_container }>
                    <Link>
                        <img src={ icono_instagram } alt="Ícono Instagram" />
                    </Link>    
                    <Link>
                        <img src={ icono_facebook } alt="Ícono Facebook" />
                    </Link>  
                    <Link>
                        <img src={ icono_tiktok } alt="Ícono TikTok" />
                    </Link> 
                </div>
                
            </div>
            <div>
                <img src={ itsocks_logo } />
            </div>
        </div>
    </footer>
  )
}
