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
                <Link>Contáctanos</Link>
                <Link>Envíos, Garantías y Devoluciones</Link>
                <Link>Plíticas de protección de datos</Link> |
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
