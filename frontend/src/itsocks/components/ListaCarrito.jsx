import React, { useState } from "react";

// Components
import { useCart } from "../../hooks/useCart";
import { ProductoCarrito } from "./ProductoCarrito";

// Estilos
import styles from "../../ui/styles/CarritoCompras.module.css";

export const ListaCarrito = () => {
  const [cantProducts, setCantProducts] = useState(0);
  const { cart, addOneToCart, subtractOneToCart, removeFromCart } = useCart();

  return (
    <div className={styles.lista_carrito}>
      <table className={styles.tabla_productos}>
        <thead>
          <tr>
            <th>PRODUCTO</th>
            <th>PRECIO</th>
            <th>CANTIDAD</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((producto) =>
            Object.keys(producto).length == 12 ? (
              <tr key={producto.id}>
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
                    <span>{producto.name.toUpperCase()}</span>
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
                      <button onClick={() => addOneToCart(producto)}>+</button>
                      <span>{producto.cantidad}</span>
                      <button onClick={() => subtractOneToCart(producto)}>
                        -
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
                    <img src={producto.imagen} alt={producto.nombre} />
                    <span>{producto.nombre.toUpperCase()}</span>
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
                    {/* <div className={styles.conteo}>
                      <button onClick={() => addOneToCart(producto)}>+</button>
                      <span>1</span>
                      <button onClick={() => subtractOneToCart(producto)}>
                        -
                      </button>
                    </div> */}
                  </div>
                </td>
                <td>
                  <div
                    className={styles.centrar}
                  >{`${producto.price.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                  })}`}</div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};
