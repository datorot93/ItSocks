import React from 'react'
import { useLocation } from 'react-router-dom';

import styles from '../styles/Susctiption.module.css';

export const Suscription = () => {

  const { pathname } = useLocation();


  return (
    (pathname === "/")
    ? <></>
    : <section className={ styles.main }>
        <div className={ styles.text_container }>
            <h2>SUSCRÍBETE</h2>
            <p>Suscríbete a nuestra página de medias de compresión y descubre la comodidad y estilo en cualquier momento del día. Obtén acceso a descuentos exclusivos y novedades de nuestra marca. ¡Haz clic ahora para unirte a nuestra comunidad de amantes de la compresión!</p>
        </div>

        <div className={ styles.suscription_container }>
            <input type="text" placeholder="Dirección de correo electrónico" />
            <button>Suscribir</button>
        </div>
    </section>
  )
}
