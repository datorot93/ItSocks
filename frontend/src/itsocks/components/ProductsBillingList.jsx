import React from 'react'



// Styles
import styles from '../../ui/styles/ProductsBillingList.module.css'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useShipping } from '../../hooks/useShipping'

export const ProductsBillingList = ({ precio_envio = ''}) => {

  const products = localStorage.getItem('cart')
  const shipping = JSON.parse(localStorage.getItem('shipping'))

  const products_list = JSON.parse(products)
  
  const subtotal = products_list.reduce( (acumulador, objeto) => {
    return acumulador + (objeto.cantidad * objeto.price)
  }, 0)

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
                      <LazyLoadImage src={ product.images.image1}/>
                      <div className={ styles.quantity }>
                        { product.cantidad }
                      </div>
                      <h3>{product.name }</h3>
                    </div>
                    :
                    <div className={ styles.product_description } >
                      <LazyLoadImage src={ product.image_url}/>
                      <div className={ styles.quantity }>
                        { product.cantidad}
                      </div>
                      <h3>{product.name }</h3>
                    </div>
                  }
                
                <span>{ product.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</span>
              </div>
            </div>
          ))
        }
        <hr />
        <div className={ styles.subtotal }>
          <div className={ styles.subtotal_up }>
            <span>Subtotal</span>
            <span><strong>{ subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</strong></span>
          </div>
          <div className={ styles.subtotal_down }>
            <div className={ styles.subtotal_up}>
              <p>Envíos</p>
              <div className={ styles.quantity }>
                ?
              </div>
            </div>
            <span><strong>{ shipping.shipping_value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</strong></span>
          </div>
          
        </div>
        <hr />
        <div className={ styles.subtotal}>
          <div className={ styles.subtotal_up}>
            <span>Total</span>
            <span><strong>{ ((subtotal) + shipping.shipping_value).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</strong></span>
          </div>
        </div>
      </div>

    </div>
  )
}
