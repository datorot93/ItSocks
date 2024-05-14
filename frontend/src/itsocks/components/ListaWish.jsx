import React, { useId, useState } from "react";

// Estilos
import styles from "../../ui/styles/CarritoCompras.module.css";
import { useWish } from "../../hooks/useWish";

export const ListaWish = ({wish}) => {
  const id = useId();

  const [cantProducts, setCantProducts] = useState(0);
  const { addOneToWish, subtractOneToWish, removeFromWish } = useWish();

  return (
    <section className={styles.lista_carrito}>


      <div className={styles.responsive_list}>

        {
          wish.map((producto, index) => (
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
                    onClick={() => subtractOneToWish(producto)}
                    className={styles.button_left}
                  >-</button>
                  <span>{producto.cantidad}</span>
                  <button 
                    onClick={() => addOneToWish(producto)}
                    className={styles.button_right}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))
        }

      </div>


      <table className={styles.tabla_productos}>
        <thead>
          <tr>
            <th className={ `${styles.table_header} ${styles.header_left}`}>PRODUCTO</th>
            <th className={ `${styles.table_header} ${styles.header_center}`}>PRECIO</th>
            <th className={ `${styles.table_header} ${styles.header_center}`}>CANTIDAD</th>
            <th className={ `${styles.table_header} ${styles.header_right}`}>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {wish.map((producto, index) =>
            "subcategory" in producto ? (
              <tr key={`${producto.id}-${index}`}>
                <td>
                  <div className={styles.td_producto}>
                    <div
                      className={styles.quitar_producto}
                      onClick={() => removeFromWish(producto)}
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
                        onClick={() => subtractOneToWish(producto)}
                        className={styles.button_left}
                      >
                        -
                      </button>
                      <span>{producto.cantidad}</span>
                      <button 
                        onClick={() => addOneToWish(producto)}
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
              <tr key={producto.id}>
                <td>
                  <div className={styles.td_producto}>
                    <div
                      className={styles.quitar_producto}
                      onClick={() => removeFromWish(producto)}
                    >
                      <span>X</span>
                    </div>
                    <img src={producto.image_url} alt={producto.name} />
                    <div className={styles.pack_description}>
                      <span>
                        <strong>{producto.name.toUpperCase()}</strong>
                      </span>
                      <ul>
                        {producto.prductos.map((item, index) => (
                          <li key={`${id}-${index}`}>{item.name}</li>
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
                        onClick={() => subtractOneToWish(producto)}
                        className={styles.button_left}
                      >-</button>
                      <span>{producto.cantidad}</span>
                      <button 
                        onClick={() => addOneToWish(producto)(producto)}
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
