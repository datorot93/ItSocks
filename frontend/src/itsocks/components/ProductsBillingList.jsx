import React from 'react'



// Styles
import styles from '../../ui/styles/ProductsBillingList.module.css'
import { LazyLoadImage } from 'react-lazy-load-image-component'

export const ProductsBillingList = ({ email, name, lastName, document, phone }) => {

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
                      <div className={ styles.image_description}>

                        <LazyLoadImage src={ product.images.image1}/>
                        <div className={ styles.quantity }>
                          { product.cantidad }
                        </div>
                      </div>
                      <p>{product.name }</p>
                    </div>
                    :
                    <div className={ styles.product_description } >
                      <div className={ styles.image_description}>
                        <LazyLoadImage src={ product.image_url}/>
                        <div className={ styles.quantity }>
                          { product.cantidad}
                        </div>
                      </div>
                      <p>{product.name }</p>
                    </div>
                  }
                
                <span><strong>{ product.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</strong></span>
              </div>
            </div>
          ))
        }
        <hr />
        <div className={ styles.subtotal }>
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
