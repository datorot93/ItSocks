// React
import React, { useState } from 'react'

// Components
import { FormShippingEstimates } from '../components/FormShippingEstimates'

// Estilos
import styles from '../../ui/styles/CarritoCompras.module.css'

// Asstets
import arrow_left_circle from '../../../public/assets/carrito/ArrowCircleLeft.svg'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ListaWish } from '../components/ListaWish'
import { useWish } from '../../hooks/useWish'
import { useCart } from '../../hooks/useCart'
import { setWishList } from '../helpers/getWishListInfo'
import { FRONTEND_URL } from '../../config'


export const WishList = () => {

  const navigate = useNavigate();
  const {pathname} = useLocation()

  const [copied, setCopied] = useState(false);
  const [copiedText, setCopiedText] = useState('');

  const { wish, addOneToWish, subtractOneToWish } = useWish();
  const { addOneToCart } = useCart();

  const handleComprarLista = () => {
    wish.forEach(product => {
      addOneToCart(product)
      subtractOneToWish(product)
    })

    navigate('/carrito', {state: {previousPath: pathname}})
  }



  const handleCompartirLista = () => {
    const text_wish = JSON.stringify(wish);

    let idsConcatenados = "";

    // Recorrer la lista de objetos y concatenar los ids
    for (let i = 0; i < wish.length; i++) {
      // Agregar el id del objeto actual a la cadena de ids concatenados
      idsConcatenados += wish[i].id;
      
      // Agregar una coma y un espacio después de cada id, excepto para el último id
      if (i < wish.length - 1) {
        idsConcatenados += "";
      }
    }

    const lista_wish = {
      "json_list": text_wish,
      "url_list": `${FRONTEND_URL}lista_de_favoritos/${idsConcatenados}`,
      "id_list": idsConcatenados
    }
    
    const resp = setWishList(lista_wish).then( data => {
      console.log(data)
    })

    try{
      navigator.clipboard.writeText(lista_wish.url_list)
        .then(() => {
          console.log("Texto copiado al portapapeles:", lista_wish.url_list);
          setCopied(true);
          setCopiedText("Lista de deseos copiada exitosamente en el portapeles");
          setTimeout(() => {
            setCopied(false);
          }, 3000);
        })
        .catch((error) => {
          
        });
    }catch(e){
      setCopied(true);
      setCopiedText(lista_wish.url_list)
      setTimeout(() => {
        setCopied(false);
      }, 5000);
      console.error("Error al copiar texto al portapapeles:", e);
    }

  }
  
  return (
    <section className={ styles.main }>

      <h1>LISTA DE DESEOS</h1>
      <div className={ styles.main_container_wish }>

        <div className={ styles.item }>
          <ListaWish wish={wish}/>
          <div 
            className={ styles.seguir_comprando}
            onClick={ () => navigate("/", {state: {previousPath: pathname}})}
          >
            <img src={ arrow_left_circle } alt="Seguir comprando"/>
            <span>Seguir comprando</span>
          </div>
          <div className={styles.wish_buttons}>
          {
            copied ? 
            <div>{ copiedText }</div>
            :<button 
              className={styles.boton_compartir_lista}
              onClick={ handleCompartirLista }
            >COMPARTIR LISTA DE DESEOS</button>
          }
            <div 
              className={ styles.link_boton_lista }
              // to={{
              //   pathname: "/carrito",
              //   state: { previousPath: pathname }
              // }}
              onClick={ handleComprarLista }
            >
              <button
                className={styles.boton_comprar_lista}
                
              >COMPRAR LISTA</button>
            </div>
            
          </div>
        </div>
      </div>

    </section>
  )
}
