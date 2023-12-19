import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import styles from '../../ui/styles/OpinionCliente.module.css';

export const OpinionCliente = ({ cliente }) => {

// Estilos

  return (
    <div className={ styles.main }>
        <div className={ styles.imagen_cliente_container }>
            <LazyLoadImage src={ cliente.src } alt={ cliente.descripcion } />
        </div>
        <div className={styles.opinion_cliente}>
            <p>{ cliente.opinion }</p>
        </div>
    </div>
  )
}
