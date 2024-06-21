import React, { useId, useState } from "react";

// Components
import { useCart } from "../../hooks/useCart";
import { ProductoCarrito } from "./ProductoCarrito";

// Estilos
import styles from "../../ui/styles/CarritoCompras.module.css";

export const ListaCarrito = () => {
  const id = useId();

  const [cantProducts, setCantProducts] = useState(0);
  const { cart, addOneToCart, subtractOneToCart, removeFromCart } = useCart();
  
  return (
    <section className={styles.lista_carrito}>

      <div className={styles.responsive_list}>

        {
          cart.map((producto, index) => 
          "subcategory" in producto ?
          (
            
            <div className={ styles.product_responsive} key={ index }>
              
                <div className={ styles.product_image_responsive}>
                  <div
                      className={styles.quitar_producto}
                      onClick={() => removeFromCart(producto)}
                  >
                    <span>X</span>
                  </div>
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
                    <button 
                      onClick={() => subtractOneToCart(producto)}
                      className={styles.button_left}
                    >-</button>
                    <span>{producto.cantidad}</span>
                    <button 
                      onClick={() => addOneToCart(producto)}
                      className={styles.button_right}
                    >
                      +
                    </button>
                  </div>
                </div>

            </div>
          ): <div className={ styles.product_responsive} key={ index }>
              
              <div className={ styles.product_image_responsive}>
                <div
                  className={styles.quitar_producto}
                  onClick={() => removeFromCart(producto)}
                >
                  <span>X</span>
                </div>
                <img
                  src={producto.image_url}
                  alt={producto.description}
                />
              </div>

              <div className={styles.product_responsive_info}>
                <div className={styles.product_responsive_info_name}>
                  <p>{producto.name.toUpperCase()}</p>
                </div>
                <div className={styles.product_responsive_info_price}>
                  <p>{`${producto.price.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                  })}`}</p>
                </div>
                <ul>
                    {producto.prductos.map((item, index) => (
                      <li key={`${index}`}>{item.name} - {item.selected_size}</li>
                    ))}
                  </ul>

              </div>

              <div className={styles.comprar}>
                <div className={styles.conteo}>
                  <button 
                    onClick={() => subtractOneToCart(producto)}
                    className={styles.button_left}
                  >-</button>
                  <span>{producto.cantidad}</span>
                  <button 
                    onClick={() => addOneToCart(producto)}
                    className={styles.button_right}
                  >
                    +
                  </button>
                </div>
              </div>

          </div>
          )
        }

      </div>

      <table className={styles.tabla_productos}>
        <thead>
          <tr>
            <th className={ `${styles.table_header} ${styles.header_left}`}><p>PRODUCTO</p></th>
            <th className={ `${styles.table_header} ${styles.header_center}`}><p>PRECIO</p></th>
            <th className={ `${styles.table_header} ${styles.header_center}`}><p>CANTIDAD</p></th>
            <th className={ `${styles.table_header} ${styles.header_right}`}><p>TOTAL</p></th>
          </tr>
        </thead>
        <tbody>
          {cart.map((producto, index) =>
            "subcategory" in producto ? (
              <tr key={`${producto.id}-${index}`}>
                <td>
                  <div className={styles.td_producto}>
                    <div
                      className={styles.quitar_producto}
                      onClick={() => removeFromCart(producto)}
                    >
                      <span>X</span>
                    </div>
                    <img
                      src={producto.images.image1}
                      alt={producto.description}
                    />
                    <span>
                      <strong>{producto.name.toUpperCase()}</strong>
                      {
                        producto.selected_size !== '' &&
                        <p>Talla: <strong>{producto.selected_size}</strong></p>
                      }

                      {
                        producto.selected_color !== '' &&
                        <p>Color: <strong>{producto.selected_color}</strong></p>
                      }

                    </span>
                  </div>
                </td>
                <td>
                  <div className={styles.centrar}>
                    <span>{`${producto.price.toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                    })}`}</span>
                  </div>
                </td>
                <td>
                  
                  <div className={styles.comprar}>
                    <div className={styles.conteo}>
                      <button 
                        onClick={() => subtractOneToCart(producto)}
                        className={styles.button_left}
                      >
                        -
                      </button>
                      <span>{producto.cantidad}</span>
                      <button 
                        onClick={() => addOneToCart(producto)}
                        className={styles.button_right}
                      >
                        +
                      </button>
                    </div>
                  </div>

                </td>
                <td>
                  <div className={styles.centrar}>
                    {`${(
                      producto.price *
                      (producto.cantidad + cantProducts)
                    ).toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                    })}`}
                  </div>
                </td>
              </tr>
            ) : (
              <tr key={index}>
                <td>
                  <div className={styles.td_producto}>
                    <div
                      className={styles.quitar_producto}
                      onClick={() => removeFromCart(producto)}
                    >
                      <span>X</span>
                    </div>
                    <img 
                      src={producto.image_url} 
                      className={styles.img_descri_prod}
                      alt={producto.name} 
                    />
                    <div className={styles.pack_description}>
                      <span>
                        <strong>{producto.name.toUpperCase()}</strong>
                      </span>
                      <ul>
                        {producto.prductos.map((item, index) => (
                          <li key={`${index}`}>{item.name} - Talla: {item.selected_size}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.centrar}>
                    <span>{`${producto.price.toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                    })}`}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.comprar}>
                    <div className={styles.conteo}>
                      <button 
                        onClick={() => subtractOneToCart(producto)}
                        className={styles.button_left}
                      >-</button>
                      <span>{producto.cantidad}</span>
                      <button 
                        onClick={() => addOneToCart(producto)}
                        className={styles.button_right}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.centrar}>{`${(
                    producto.price * producto.cantidad
                  ).toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                  })}`}</div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </section>
  );
};
