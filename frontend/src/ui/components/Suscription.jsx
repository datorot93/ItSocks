import React from 'react'
import { useLocation } from 'react-router-dom';

import styles from '../styles/Susctiption.module.css';

export const Suscription = () => {

  const { pathname } = useLocation();


  return (
    <section className={ styles.main }>
        <div className={ styles.text_container }>
            <h2>SUSCRÍBETE</h2>
            <div className={ styles.suscribete } >

              <p>Suscríbete a nuestra página y obtén acceso a descuentos exclusivos y novedades de nuestra marca.</p>
            </div>
            <p className={ styles.haz_click }>
              ¡Haz click ahora para unirte a nuestra comunidad!
            </p>
        </div>

        <div className={ styles.suscription_container }>
            <input type="text" placeholder="Dirección de correo electrónico" />
            <button>Suscribir</button>
        </div>
    </section>
  )
}
