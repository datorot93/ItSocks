// React
import React from 'react'

// Components
import { ListaCarrito } from '../components/ListaCarrito'
import { FormShippingEstimates } from '../components/FormShippingEstimates'

// Estilos
import styles from '../../ui/styles/CarritoCompras.module.css'

// Asstets
import arrow_left_circle from '../../../public/assets/carrito/ArrowCircleLeft.svg'

export const CarritoCompras = () => {

  
  
  return (
    <section className={ styles.main }>

      <h1>CARRITO DE COMPRA</h1>
      <div className={ styles.main_container }>

        <div className={ styles.item }>
          <ListaCarrito />
          <div className={ styles.seguir_comprando}>
            <img src={ arrow_left_circle } alt="Seguir comprando"/>
            <span>Seguir comprando</span>
          </div>
          <p>We processes all orders in COP. While the content of your cart is currently displayed in COP, the checkout will use COP at the most current exchange rate.</p>
        </div>

        <div>
          <FormShippingEstimates />
        </div>
      </div>

    </section>
  )
}
