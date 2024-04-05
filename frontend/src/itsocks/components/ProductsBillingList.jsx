import React, { useState } from 'react'



// Styles
import styles from '../../ui/styles/ProductsBillingList.module.css'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useLocation } from 'react-router-dom'
import { getDiscountCode } from '../helpers/getDiscountsCodes'

export const ProductsBillingList = ({ email, name, lastName, document, phone }) => {

  const products = localStorage.getItem('cart')
  const shipping = JSON.parse(localStorage.getItem('shipping'))

  const [ code, setCode ] = useState('')
  const [ discount, setDiscount ] = useState(null)
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
        setDiscount(res.discount)
        setSubtotal(subtotal - (subtotal * (res.discount / 100)))
        setInputDisabled(true)
      }
    })
  }

  const handleDeleteDiscount = () => {
    setDiscount(null)
    setSubtotal(previusSubtotal)
    setInputDisabled(false)
    setCode('')
  }

  // console.log(shipping)
  return (
    <div className={ styles.main_billing_articles }> 
      <h1>Artículos de envío</h1>
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
                          discount !== null &&
                          <p className={ styles.discount_text }>{ `${code.toUpperCase()} (-${(previusSubtotal * (discount / 100)).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })})` }</p>
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
                          discount !== null &&
                          <p className={ styles.discount_text }>{ code.toUpperCase() }</p>
                        }
                      </div>
                    </div>
                  }
                  {
                    discount !== null ?
                    <div className={ styles.prices_discount }>
                      <p>{ product.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</p>
                      <span><strong>{ (product.price -  (product.price * (discount/100))).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</strong></span>
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
              disabled={ inputDisabled }
            />
            <button 
              onClick={ handleAplicarCupon } 
              className={ styles.button_cupon }
              disabled={ inputDisabled }
            >Aplicar</button>
          </div>
        }
        {
          discount !== null &&
          <div className={ styles.discount_code }>
              <div className={ styles.code }>
                {code}
                <div className={ styles.delete_discount} onClick={ handleDeleteDiscount }>x</div>
              </div>
          </div>
        }
        
        <hr />
        <div className={ styles.subtotal }>
          {
            discount !== null &&
            <div className={ styles.subtotal_up }>
              <p><strong>Descuento</strong></p>
              <p><strong>{ discount }%</strong></p>
            </div>
          }

          <div className={ styles.subtotal_up }>
            <p><strong>Subtotal</strong></p>
            <p><strong>{ subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</strong></p>
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
