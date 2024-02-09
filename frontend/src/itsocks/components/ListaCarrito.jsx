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
              <tr key={producto.id}>
                <td>
                  <div className={styles.td_producto}>
                    <div
                      className={styles.quitar_producto}
                      onClick={() => removeFromCart(producto)}
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
                        onClick={() => subtractOneToCart(producto)}
                        className={styles.button_left}
                      >-</button>
                      <span>{producto.cantidad}</span>
                      <button 
                        onClick={() => addOneToCart(producto)(producto)}
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
