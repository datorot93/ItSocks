import React from 'react';

// Iconos
import icono_envios from '../../../public/assets/mas/Icono de envios.svg';
import icono_preguntas from '../../../public/assets/mas/Icono Preguntas.svg';
import icono_tallas from '../../../public/assets/mas/Icono tallas.svg';
import icono_ventas_por_mayor from '../../../public/assets/mas/Icono ventas por mayor.svg';

import styles from '../../ui/styles/Mas.module.css';
import { Link } from 'react-router-dom';

export const Mas = () => {
    return (
    <>
        <section  className={ styles.main }>
        <h1>MÁS</h1>
        <div className={ styles.container }>
            <div className={ styles.link_container}>
                <img src={ icono_ventas_por_mayor } alt="Ventas al por mayor" />
                <a
                    href={`https://api.whatsapp.com/send?phone=573143939837&text=Hola!%20Cordial%20saludo,%20estoy%20interesad@%20en%20comprar%20productos%20IT%20SOCKS%20al%20por%20mayor,%20me%20podrías%20dar%20más%20información%2E%20Gracias`}
                    target='_blank'
                >
                    <p>Ventas al por mayor</p>        
                </a>
            </div>
            <div className={ styles.link_container}>
                <img src={ icono_envios } alt="Ventas al por mayor" />
                <Link
                    to="/mas/envios_garantias_cambios"
                >
                    <p>Envíos, Garantías y Cambios</p>
                </Link>
            </div>
            <div className={ styles.link_container}>
                <img src={ icono_tallas } alt="Ventas al por mayor" />
                <Link
                    to="guia_tallas"
                >
                    <p>Tabla de tallas</p>
                </Link>
            </div>
            <div className={ styles.link_container}>
                <img src={ icono_preguntas } alt="Ventas al por mayor" />
                <Link
                    to="preguntas_frecuentes"
                >
                    <p>Preguntas frecuentes</p>
                </Link>
            </div>
        </div>
        </section>
    </>
    )
}
