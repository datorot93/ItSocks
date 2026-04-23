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
import { useShipping } from '../../hooks/useShipping';
import { useCart } from '../../hooks/useCart';
import { getCategoryDiscount, getDesignDiscount, getSubcategoryDiscount, getTypeDiscount } from '../helpers/getShippingInfo';

export const ProductsBillingList = ({ email, name, lastName, document, phone }) => {

  const products = localStorage.getItem('cart')
  // const shipping = JSON.parse(localStorage.getItem('shipping'))

  const { shipping, modifyShipping } = useShipping()
  const { cart, modifyCartProduct } = useCart()
  
  const { discount, addToDiscount, removeFromDiscount } = useDiscount()

  // States
  const [ code, setCode ] = useState('')
  const [ currentDiscount, setCurrentDiscount ] = useState(discount ? discount : null)
  const [ inputDisabled, setInputDisabled ] = useState(false)
  const [ productToModify, setProductToModify ] = useState({})
  // Descuentos
  const [ categoryDiscounts, setCategoryDiscounts ] = useState({});
  const [ subcategoryDiscounts, setSubcategoryDiscounts ] = useState({});
  const [ typeDiscounts, setTypeDiscounts ] = useState({});
  const [ designDiscounts, setDesignDiscounts ] = useState({});
  
  const {pathname} = useLocation()
  
  // const products_list = JSON.parse(products)
  
  const [subtotal, setSubtotal] = useState(shipping.subtotal)

  const [previusSubtotal, setPreviusSubtotal] = useState(subtotal)
  

  const handleCode = (e) => {
    setCode(e.target.value)
  }

  // useEffect(() => {

    
  // }, [])

  useEffect(() => {

    const products_categories = cart.reduce((acc, item) => {

      if (!acc.categories.includes(item.category) && item.category) {
          acc.categories.push(item.category.toLowerCase());
      }
      if (!acc.subcategories.includes(item.subcategory) && item.subcategory) {
          acc.subcategories.push(item.subcategory.toLowerCase());
      }
      if (!acc.types.includes(item.type) && item.type) {
          acc.types.push(item.type.toLowerCase());
      }
      if (!acc.designs.includes(item.design) && item.design) {
          acc.designs.push(item.design.toLowerCase());
      }
      return acc;
      }, {
          categories: [],
          subcategories: [],
          types: [],
          designs: []
      }
    );

    getCategoryDiscount(products_categories['categories']).then(
      (res) => setCategoryDiscounts(res)
    )

    getSubcategoryDiscount(products_categories['subcategories']).then(
      (res) => setSubcategoryDiscounts(res)
    )

    getTypeDiscount(products_categories['types']).then(
      (res) => setTypeDiscounts(res)
    )

    getDesignDiscount(products_categories['designs']).then(
      (res) => setDesignDiscounts(res)
    )

    

  }, [currentDiscount])

  useEffect( () => {
    cart.forEach( (product) => {
      
      const discounts = getDiscounts(product)

      const maxDiscount = Math.max.apply(null, discounts);
      modifyCartProduct({
        ...product,
        discount: maxDiscount,
        codigo_descuento: ""
      });
    });
  }, [categoryDiscounts, subcategoryDiscounts, typeDiscounts, designDiscounts])



  const getDiscounts = (objeto) => {
    const discounts = []

    

    discounts.push(objeto.discount)

    if (categoryDiscounts[objeto.category.toLowerCase()]){
      discounts.push(categoryDiscounts[objeto.category.toLowerCase()])
    }
    if (subcategoryDiscounts[objeto.subcategory.toLowerCase()]){
      discounts.push(subcategoryDiscounts[objeto.subcategory.toLowerCase()])
    }
    if (typeDiscounts[objeto.type.toLowerCase()]){
      discounts.push(typeDiscounts[objeto.type.toLowerCase()])
    }
    if (designDiscounts[objeto.design.toLowerCase()]){
      discounts.push(designDiscounts[objeto.design.toLowerCase])
    }

    if (currentDiscount !== null){
      discounts.push(currentDiscount.discount)
    }

    return discounts
  }

  const handleAplicarCupon = () => {
    getDiscountCode(code).then((res) => {
      if (res) {
        // Guardar la respuesta en una variable local para usarla inmediatamente
        const discountResponse = res;
        setCurrentDiscount(discountResponse);
        addToDiscount(discountResponse);
  
        setPreviusSubtotal(shipping.subtotal);
  
        // Calcular nuevo subtotal y actualizar productos 
        const newSubtotal = cart.reduce((acumulador, objeto) => {
          if (!objeto.name.toLowerCase().includes("pares")) {
            // Obtener descuentos SIN incluir el nuevo código primero
            const discountsWithoutCode = getDiscountsWithoutNewCode(objeto);
            const maxDiscountWithoutCode = Math.max.apply(null, discountsWithoutCode);
            
            // Si el descuento del código es mayor o igual que el máximo actual,
            // asignamos el código al producto
            if (discountResponse.discount >= maxDiscountWithoutCode) {
              // Llamar directamente a modifyCartProduct sin pasar por estado
              modifyCartProduct({
                ...objeto,
                discount: discountResponse.discount,
                discount_code: discountResponse.code // Usar el mismo nombre que en cartReducer
              });
              
              // Calcular precio con descuento
              return (acumulador + (objeto.cantidad * objeto.price)) - 
                (objeto.cantidad * objeto.price * (discountResponse.discount / 100));
            } else {
              modifyCartProduct({
                ...objeto,
                discount: maxDiscountWithoutCode,
                discount_code: "" // No hay código porque otro descuento es mayor
              });
              
              // Calcular precio con el descuento máximo existente
              return (acumulador + (objeto.cantidad * objeto.price)) - 
                (objeto.cantidad * objeto.price * (maxDiscountWithoutCode / 100));
            }
          } else {
            return acumulador + objeto.price * objeto.cantidad - 
              (objeto.price * (objeto.discount / 100));
          }
        }, 0);
  
        setSubtotal(newSubtotal);
  
        modifyShipping({
          discount: 0,
          subtotal: newSubtotal,
          total: newSubtotal + shipping.shipping_value,
          discount_code: discountResponse.code
        });
  
        setInputDisabled(true);
        
        console.log('Productos actualizados:', cart); // Para depuración
      }
    });
  };
  
  // Función auxiliar para obtener descuentos sin incluir el nuevo código
  const getDiscountsWithoutNewCode = (objeto) => {
    const discounts = [];
    
    discounts.push(objeto.discount || 0);
  
    if (categoryDiscounts[objeto.category?.toLowerCase()]) {
      discounts.push(categoryDiscounts[objeto.category.toLowerCase()]);
    }
    if (subcategoryDiscounts[objeto.subcategory?.toLowerCase()]) {
      discounts.push(subcategoryDiscounts[objeto.subcategory.toLowerCase()]);
    }
    if (typeDiscounts[objeto.type?.toLowerCase()]) {
      discounts.push(typeDiscounts[objeto.type.toLowerCase()]);
    }
    if (designDiscounts[objeto.design?.toLowerCase()]) {
      discounts.push(designDiscounts[objeto.design.toLowerCase()]);
    }
    
    return discounts;
  };

  const handleDeleteDiscount = () => {
    removeFromDiscount();
    setCurrentDiscount(null);
    setSubtotal(previusSubtotal);
  
    modifyShipping({
      discount: 0,
      subtotal: previusSubtotal,
      total: previusSubtotal + shipping.shipping_value,
      discount_code: ''
    });
    setInputDisabled(false);
    
    setCode('');
  
    cart.forEach((product) => {
      if (product.discount_code !== '') {
        modifyCartProduct({
          ...product,
          discount: 0,
          discount_code: '' // Usar la misma propiedad que antes
        });
      }
    });
  };

  // console.log(shipping)
  return (
    <div className={ styles.main_billing_articles }>

      <div className={ styles.billing_header }>
        <img src={ itsocks_logo } alt="Logo de Itsocks"/>
      </div>

      <h1>Artículos de envío</h1>

      {/* ARTÍCULOS RESPONSIVE */}
      <div className={styles.responsive_list}>

        {
          cart.map((producto, index) => {
            
            return(

              <div className={ styles.product_responsive} key={ index }>
                {
                  producto.images && producto.images['image1'] != undefined ?
                  <>
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
                        <p>{`${(producto.price - (producto.price * (producto.discount))).toLocaleString("es-CO", {
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
                  </>
                  :<>
                    <div className={ styles.product_image_responsive}>
                    <img
                      src={producto.image_url}
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
                  </>
                }
                
              </div>
            )
          })
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
          currentDiscount &&
          <div className={ styles.discount_code }>
              <div className={ styles.code }>
                {currentDiscount.code.toUpperCase()}
                <div className={ styles.delete_discount} onClick={ handleDeleteDiscount }>x</div>
              </div>
          </div>
        }

        <hr />
        <div className={ styles.subtotal }>
          {
            currentDiscount  &&
            <div className={ styles.subtotal_up }>
              <p><strong>Descuento: </strong></p>
              <p>{ currentDiscount.discount }%</p>
            </div>
          }

          <div className={ styles.subtotal_up }>
            <p><strong>Subtotal: </strong></p>
            {
              currentDiscount ?
              <p>{ (shipping.subtotal).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</p>
              :<p>{ shipping.subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</p>
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

      {/* ARTÍCULOS DESKTOP */}

      <div className={ styles.products}>
        {
          cart.map( (product, index) => {

            const discounts = getDiscounts(product)

            // const discounts = []
            let final_price = 0

            // if (currentDiscount !== null){
            //   discounts.push(currentDiscount.discount)
            // }
            if (!product.name.toLowerCase().includes("pares")) {
              
              // discounts.push(product.discount)
      
              // if (categoryDiscounts[product.category.toLowerCase()]){
              //   discounts.push(categoryDiscounts[product.category.toLowerCase()])
              // }
              // if (subcategoryDiscounts[product.subcategory.toLowerCase()]){
              //   discounts.push(subcategoryDiscounts[product.subcategory.toLowerCase()])
              // }
              // if (typeDiscounts[product.type.toLowerCase()]){
              //   discounts.push(typeDiscounts[product.type.toLowerCase()])
              // }
              // if (designDiscounts[product.design.toLowerCase()]){
              //   discounts.push(designDiscounts[product.design.toLowerCase])
              // }


      
              final_price =   (product.cantidad * product.price) - (
                product.cantidad * product.price * (Math.max.apply(null,discounts) / 100)
              )
              
              // if (currentDiscount !== null){

              //   modifyCartProduct({
              //     ...product,
              //     discount: Math.max.apply(null,discounts),
              //     discount_code: (currentDiscount.discount && currentDiscount.discount == Math.max.apply(null,discounts)) ? currentDiscount.code : ""
              //   })
              // } else {
                // modifyCartProduct({
                //   ...product,
                //   discount: Math.max.apply(null,discounts),
                //   discount_code: ""
                // })
              // }
              
              // if(currentDiscount){
              //   modifyCartProduct({
              //     ...product,
              //     discount: Math.max.apply(null,discounts),
              //     discount_code: (currentDiscount.discount && currentDiscount.discount == Math.max.apply(null,discounts)) ? currentDiscount.code : ""
              //   })
              // }
      
            } else {
              final_price = product.price * product.cantidad - (
                product.price * (product.discount / 100)
              );
            }
            

            return (
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
                            currentDiscount &&
                            <p className={ styles.discount_text }>{ `${currentDiscount.code.toUpperCase()}` }</p>
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
                            currentDiscount &&
                            <p className={ styles.discount_text }>{ code.toUpperCase() }</p>
                          }
                        </div>
                      </div>
                    }
                    {
                      final_price != product.price ?
                      <div className={ styles.prices_discount }>
                        <p>{ product.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</p>
                        <span><strong>{ (final_price).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</strong></span>
                      </div>
                      : <span><strong>{ (product.price).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</strong></span>
                    }
                </div>
              </div>
            )
          })
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
          currentDiscount &&
          <div className={ styles.discount_code }>
              <div className={ styles.code }>
                {currentDiscount.code.toUpperCase()}
                <div className={ styles.delete_discount} onClick={ handleDeleteDiscount }>x</div>
              </div>
          </div>
        }
        
        <hr />
        <div className={ styles.subtotal }>
          {
            currentDiscount &&
            <div className={ styles.subtotal_up }>
              <p><strong>Descuento</strong></p>
              <p><strong>{ currentDiscount.discount }%</strong></p>
            </div>
          }

          <div className={ styles.subtotal_up }>
            <p><strong>Subtotal</strong></p>
            {
              currentDiscount !== null ?
              <p><strong>{ (shipping.subtotal).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</strong></p>
              :<p><strong>{ (shipping.subtotal).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</strong></p>
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
            <span>COP <strong>{ (shipping.total).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }</strong></span>
          </div>
        </div>
      </div>

    </div>
  )
}
