import React, { useEffect, useState } from 'react'

// Icons
import itsocks_logo from '../../../public/assets/navbar/itsocks_logo.png';
import fase_1 from '../../../public/assets/pago/1_fase.png'

// Styles
import styles from '../../ui/styles/ProductsBillingList.module.css'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useLocation } from 'react-router-dom'
import { getDiscountCode } from '../helpers/getDiscountsCodes'
import { useDiscount } from '../../hooks/useDiscount'

export const ProductsBillingList = ({ email, name, lastName, document, phone }) => {

  const products = localStorage.getItem('cart')
  const shipping = JSON.parse(localStorage.getItem('shipping'))

  const { discount, addToDiscount, removeFromDiscount } = useDiscount()

  const [ code, setCode ] = useState('')
  const [ currentDiscount, setCurrentDiscount ] = useState(discount ? discount.discount : null)
  const [ inputDisabled, setInputDisabled ] = useState(false)
  
  const {pathname} = useLocation()
  
  const products_list = JSON.parse(products)
  
  const [subtotal, setSubtotal] = useState(products_list.reduce( (acumulador, objeto) => {
    return acumulador + (objeto.cantidad * objeto.price)
  }, 0))

  const [previusSubtotal, setPreviusSubtotal] = useState(subtotal)
  
  // const subtotal = products_list.reduce( (acumulador, objeto) => {
  //   return acumulador + (objeto.cantidad * objeto.price)
  // }, 0)

  const handleCode = (e) => {
    setCode(e.target.value)
  }

  const handleAplicarCupon = () => {
    getDiscountCode(code).then( (res) => {
      // setDiscountCode(res.)
      if(res){
        setCurrentDiscount(res.discount)
        setSubtotal(subtotal - (subtotal * (res.discount / 100)))
        setInputDisabled(true)
        addToDiscount(res)
      }
    })
  }

  useEffect(() => {
    if(currentDiscount !== null){
      setPreviusSubtotal(subtotal)
      setSubtotal(subtotal - (subtotal * (currentDiscount / 100)))
    }
  }, [])

  console.log(discount)

  const handleDeleteDiscount = () => {
    setCurrentDiscount(null)
    setSubtotal(previusSubtotal)
    setInputDisabled(false)
    removeFromDiscount()
    setCode('')
  }

  // console.log(shipping)
  return (
    <div className={ styles.main_billing_articles }>

      <div className={ styles.billing_header }>
        <img src={ itsocks_logo } alt="Logo de Itsocks"/>
      </div>

      <h1>Artículos de envío</h1>

      <div className={styles.responsive_list}>

        {
          products_list.map((producto, index) => (
            <div className={ styles.product_responsive} key={ index }>
              <div className={ styles.product_image_responsive}>
                <img
                  src={producto.images.image1}
                  alt={producto.description}
                />
              </div>

              <div className={styles.product_responsive_info}>
                <div className={styles.product_responsive_info_name}>
                  <p>{producto.name.toUpperCase()}</p>
                  {
                    producto.selected_size !== '' &&
                    <p>Talla: {producto.selected_size} </p>
                  }

                  {
                    producto.selected_color !== '' &&
                    <p>Color: {producto.selected_color} </p>
                  }
                </div>
                <div className={styles.product_responsive_info_price}>
                  <p>{`${producto.price.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                  })}`}</p>
                </div>
              </div>

              <div className={styles.comprar}>
                <div className={styles.conteo}>

                  <span>{producto.cantidad}</span>

                </div>
              </div>
            </div>
          ))
        }

        {
          pathname === '/carrito/billing' &&
          <div className={ styles.cupon_container }>
            <input 
              className={ styles.input_cupon } 
              value={code} 
              onChange={ handleCode } 
              type="text" 
              placeholder="Código de descuento"
              disabled={ Boolean(discount) }
            />
            <button 
              onClick={ handleAplicarCupon } 
              className={ styles.button_cupon }
              disabled={ Boolean(discount) }
            >Aplicar</button>
          </div>
        }

        {
          currentDiscount !== null &&
          <div className={ styles.discount_code }>
              <div className={ styles.code }>
                {discount.code.toUpperCase()}
                <div className={ styles.delete_discount} onClick={ handleDeleteDiscount }>x</div>
              </div>
          </div>
        }

        <hr />
        <div className={ styles.subtotal }>
          {
            currentDiscount !== null &&
            <div className={ styles.subtotal_up }>
              <p><strong>Descuento: </strong></p>
              <p>{ currentDiscount }%</p>
            </div>
          }

          <div className={ styles.subtotal_up }>
            <p><strong>Subtotal: </strong></p>
            {
              currentDiscount !== null ?
              <p>{ (subtotal).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</p>
              :<p>{ subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</p>
            }
          </div>

          <div className={ styles.subtotal_down }>
            <div className={ styles.subtotal_up}>
              <p><strong>Envíos: </strong></p>
              {/* <div className={ styles.quantity }>
                ?
              </div> */}
            </div>
            <p>{ shipping.shipping_value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</p>
          </div>
          
        </div>
        <hr />
        <div className={ styles.subtotal}>
          <div className={ styles.subtotal_up}>
            <p><strong>Total: </strong></p>
            <span>COP { ((subtotal) + shipping.shipping_value).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</span>
          </div>
        </div>

      </div>

      <div className={ styles.products}>
        {
          products_list.map( (product, index) => (
            <div key={ index }>
              <div key={ product.id } className={ styles.product }>
                  {
                    product.images && product.images['image1'] != undefined ?
                    <div className={ styles.product_description } >
                      <div className={ styles.image_description}>

                        <LazyLoadImage src={ product.images.image1}/>
                        <div className={ styles.quantity }>
                          { product.cantidad }
                        </div>
                      </div>
                      <div className={ styles.product_name }>
                        <p>{product.name }</p>
                        {
                          currentDiscount !== null &&
                          <p className={ styles.discount_text }>{ `${discount.code.toUpperCase()} (-${(previusSubtotal * (discount.discount / 100)).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })})` }</p>
                        }
                      </div>
                    </div>
                    :
                    <div className={ styles.product_description } >
                      <div className={ styles.image_description}>
                        <LazyLoadImage src={ product.image_url}/>
                        <div className={ styles.quantity }>
                          { product.cantidad}
                        </div>
                      </div>
                      <div className={styles.product_name}>
                        <p>{product.name }</p>
                        {
                          currentDiscount !== null &&
                          <p className={ styles.discount_text }>{ code.toUpperCase() }</p>
                        }
                      </div>
                    </div>
                  }
                  {
                    currentDiscount !== null ?
                    <div className={ styles.prices_discount }>
                      <p>{ product.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</p>
                      <span><strong>{ (product.price -  (product.price * (currentDiscount/100))).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</strong></span>
                    </div>
                    : <span><strong>{ (product.price).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</strong></span>
                  }
              </div>
            </div>
          ))
        }

        {
          pathname === '/carrito/billing' &&
          <div className={ styles.cupon_container }>
            <input 
              className={ styles.input_cupon } 
              value={code} 
              onChange={ handleCode } 
              type="text" 
              placeholder="Código de descuento"
              disabled={ Boolean(discount) }
            />
            <button 
              onClick={ handleAplicarCupon } 
              className={ styles.button_cupon }
              disabled={ Boolean(discount) }
            >Aplicar</button>
          </div>
        }
        {
          currentDiscount !== null &&
          <div className={ styles.discount_code }>
              <div className={ styles.code }>
                {discount.code.toUpperCase()}
                <div className={ styles.delete_discount} onClick={ handleDeleteDiscount }>x</div>
              </div>
          </div>
        }
        
        <hr />
        <div className={ styles.subtotal }>
          {
            currentDiscount !== null &&
            <div className={ styles.subtotal_up }>
              <p><strong>Descuento</strong></p>
              <p><strong>{ currentDiscount }%</strong></p>
            </div>
          }

          <div className={ styles.subtotal_up }>
            <p><strong>Subtotal</strong></p>
            {
              currentDiscount !== null ?
              <p><strong>{ (subtotal).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</strong></p>
              :<p><strong>{ subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</strong></p>
            }
          </div>
          <div className={ styles.subtotal_down }>
            <div className={ styles.subtotal_up}>
              <p><strong>Envíos</strong></p>
              {/* <div className={ styles.quantity }>
                ?
              </div> */}
            </div>
            <p><strong>{ shipping.shipping_value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</strong></p>
          </div>
          
        </div>
        <hr />
        <div className={ styles.subtotal}>
          <div className={ styles.subtotal_up}>
            <span>Total</span>
            <span>COP <strong>{ ((subtotal) + shipping.shipping_value).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</strong></span>
          </div>
        </div>
      </div>

    </div>
  )
}
