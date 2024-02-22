// React
import React from 'react'

// Components
import { ListaCarrito } from '../components/ListaCarrito'
import { FormShippingEstimates } from '../components/FormShippingEstimates'

// Estilos
import styles from '../../ui/styles/CarritoCompras.module.css'

// Asstets
import arrow_left_circle from '../../../public/assets/carrito/ArrowCircleLeft.svg'
import { useNavigate } from 'react-router-dom'

export const CarritoCompras = () => {

  const navigate = useNavigate();
  
  return (
    <section className={ styles.main }>

      <h1>CARRITO DE COMPRA</h1>
      <div className={ styles.main_container }>

        <div className={ styles.item }>
          <ListaCarrito />
          <div 
            className={ styles.seguir_comprando}
            onClick={ () => navigate(-2)}
          >
            <img src={ arrow_left_circle } alt="Seguir comprando"/>
            <span>Seguir comprando</span>
          </div>
          
        </div>

        <div>
          <FormShippingEstimates />
        </div>
      </div>

    </section>
  )
}
