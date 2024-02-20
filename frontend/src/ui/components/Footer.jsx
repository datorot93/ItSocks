import React from 'react';

import { Link } from 'react-router-dom';

import styles from './../styles/Footer.module.css';

import itsocks_logo from '../../assets/navbar/itsocks_logo.png';
import icono_facebook from '../../assets/footer/icono_facebook.svg';
import icono_instagram from '../../assets/footer/icono_instagram.svg';
import icono_tiktok from '../../assets/footer/icono_tiktok.svg';
import icono_whatsapp from '../../assets/footer/icono_whatsapp.svg';

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
                >Envíos, Garantías y Cambios</Link>
                <Link
                    to='/politicas_proteccion_datos'
                >Plíticas de protección de datos</Link> |
                <div className={ styles.icons_container }>
                    <a 
                        href={`https://api.whatsapp.com/send?phone=573143939837&text=Hola!%20Cordial%20saludo,%20estoy%20interesad@%20en%20comprar%20productos%20IT%20SOCKS,%20me%20podrías%20dar%20más%20información%2E%20Gracias`}
                        target='_blank'
                    >
                        <img src={ icono_whatsapp } alt="Ícono WhatsApp" />
                    </a> 
                    <a 
                        href="https://www.instagram.com/itsocks_/"
                        target='_blank'
                    >
                        <img src={ icono_instagram } alt="Ícono Instagram" />
                    </a>    
                    <a>
                        <img src={ icono_facebook } alt="Ícono Facebook" />
                    </a>  
                    <a 
                        href="https://www.tiktok.com/@itsocksco?_t=8jyYTY4zp3e&_r=1"
                        target='_blank'
                    >
                        <img src={ icono_tiktok } alt="Ícono TikTok" />
                    </a>
                </div>
                
            </div>
            <div>
                <img src={ itsocks_logo } />
            </div>
        </div>
    </footer>
  )
}
