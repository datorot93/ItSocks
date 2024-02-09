// React
import React from 'react'

// Components
import { FormShippingEstimates } from '../components/FormShippingEstimates'

// Estilos
import styles from '../../ui/styles/CarritoCompras.module.css'

// Asstets
import arrow_left_circle from '../../../public/assets/carrito/ArrowCircleLeft.svg'
import { Link, useNavigate } from 'react-router-dom'
import { ListaWish } from '../components/ListaWish'
import { useWish } from '../../hooks/useWish'

export const WishList = () => {

  const navigate = useNavigate();

  const { wish, addOneToWish, subtractOneToWish, removeFromWish } = useWish();

  const handleComprarLista = () => {
    navigate('/carrito')
  }
  
  return (
    <section className={ styles.main }>

      <h1>LISTA DE DESEOS</h1>
      <div className={ styles.main_container_wish }>

        <div className={ styles.item }>
          <ListaWish />
          <div 
            className={ styles.seguir_comprando}
            onClick={ () => navigate(-2)}
          >
            <img src={ arrow_left_circle } alt="Seguir comprando"/>
            <span>Seguir comprando</span>
          </div>
          <div className={styles.wish_buttons}>
            <button className={styles.boton_compartir_lista}>COMPARTIR LISTA DE DESEOS</button>
            <Link 
              className={ styles.link_boton_lista }
              onClick={ handleComprarLista }
              to="/carrito"
            >
              <button
                className={styles.boton_comprar_lista}
                
              >COMPRAR LISTA</button>
            </Link>
          </div>
        </div>
      </div>

    </section>
  )
}
