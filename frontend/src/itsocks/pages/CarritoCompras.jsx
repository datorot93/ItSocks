// React
import React, { useEffect, useState } from 'react'

// Components
import { ListaCarrito } from '../components/ListaCarrito'
import { FormShippingEstimates } from '../components/FormShippingEstimates'

// Estilos
import styles from '../../ui/styles/CarritoCompras.module.css'

// Asstets
import arrow_left_circle from '../../../public/assets/carrito/ArrowCircleLeft.svg'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePack } from '../../hooks/usePack'

export const CarritoCompras = () => {

  const navigate = useNavigate();
  const { clearPack } = usePack()



  const handelReturn = () => {
    clearPack()
    navigate(-3)
  }
  
  return (
    <section className={ styles.main }>

      <h1>CARRITO DE COMPRA</h1>
      <div className={ styles.main_container }>

        <div className={ styles.item }>
          <ListaCarrito />
          <div 
            className={ styles.seguir_comprando}
            onClick={ handelReturn}
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
