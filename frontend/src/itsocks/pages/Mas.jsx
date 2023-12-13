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
        <h1>Mas</h1>
        <div className={ styles.container }>
            <div className={ styles.link_container}>
                <img src={ icono_ventas_por_mayor } alt="Ventas al por mayor" />
                <Link
                    to=""
                    >
                    <p>Ventas al por mayor</p>        
                </Link>
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
                    to=""
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
