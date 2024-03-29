// React
import React, { useEffect, useState } from 'react'

// Components
import { FormShippingEstimates } from '../components/FormShippingEstimates'

// Estilos
import styles from '../../ui/styles/CarritoCompras.module.css'

// Asstets
import arrow_left_circle from '../../../public/assets/carrito/ArrowCircleLeft.svg'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ListaWish } from '../components/ListaWish'
import { useWish } from '../../hooks/useWish'
import { useCart } from '../../hooks/useCart'
import { getWishList, setWishList } from '../helpers/getWishListInfo'
import { FRONTEND_URL } from '../../config'


export const WishListShared = () => {

  
  const navigate = useNavigate();
  const {pathname} = useLocation()
  
  const { subtractOneToWish } = useWish();
  const { addOneToCart } = useCart();
  
  const params = useParams()
  const [wish, setWish] = useState([])
  
  // console.log(params.id_lista)

  useEffect(() => {
    getWishList(params.id_lista).then( data => {
      setWish(JSON.parse(data[0].json_list))
    })
  }, [])

  const handleComprarLista = () => {
    wish.forEach(product => {
      addOneToCart(product)
      subtractOneToWish(product)
    })

    navigate('/carrito', {state:{ previousPath: pathname}})
  }
  
  return (
    <section className={ styles.main }>

      <h1>LISTA DE DESEOS</h1>
      <div className={ styles.main_container_wish }>

        <div className={ styles.item }>
          {
            wish.length > 0 ? 
            <ListaWish wish={wish}/>
            :<p>No hay productos en la lista de deseos</p>
          }
          <div 
            className={ styles.seguir_comprando}
            onClick={ () => navigate("/")}
          >
            <img src={ arrow_left_circle } alt="Seguir comprando"/>
            <span>Seguir comprando</span>
          </div>
          <div className={styles.wish_buttons}>

            <Link 
              className={ styles.link_boton_lista }
              to="/carrito"
            >
              <button
                className={styles.boton_comprar_lista}
                onClick={ handleComprarLista }
              >COMPRAR LISTA</button>
            </Link>
          </div>
        </div>
      </div>

    </section>
  )
}
