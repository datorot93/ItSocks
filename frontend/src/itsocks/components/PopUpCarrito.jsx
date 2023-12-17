import React, { useEffect, useState } from "react";

// Estilos
import styles from "../../ui/styles/PopUpCarrito.module.css";
import camion from "../../../public/assets/producto/camion.svg";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

export const PopUpCarrito = ({ title, product, showPopUp, setShowPopUp }) => {
  const handleClickCarrito = () => {
    console.log("Este es un mensaje temporal");
  };

  const handleCloseClick = () => {
    setShowPopUp(false);
  };

  const handleClickComprar = () => {
    useNavigate("");
  };

  const { cart } = useCart();

  const total = cart.reduce((acumulador, objeto) => {
    // Agregar una condición para filtrar elementos
    if (!objeto.name.toLowerCase().includes("pack")) {
      return acumulador + objeto.cantidad * objeto.price;
    } else {
      return acumulador + objeto.price; // No se suma al acumulador si no cumple la condición
    }
  }, 0);

  return (
    <>
      {showPopUp && (
        <div className={styles.container}>
          <div className={styles.title} onClick={handleCloseClick}>
            <h1>{title}</h1>
            <span>X</span>
          </div>

          <div className={styles.product_container}>
            <div className={styles.product_image}>
              <img
                src={product.images[Object.keys(product.images)[0]]}
                alt="Imagen producto"
              />
            </div>
            <div className={styles.product_description}>
              <p> {product.name}</p>
              <div className={styles.price}>
                <p>
                  {product.price.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.costo_envio}>
            <img src={camion} alt="Ícono camion" />

            <p>
              {total < 250000 ? (
                <span>
                  Lleva{" "}
                  <strong>{`${(250000 - total).toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                  })} `}</strong>{" "}
                  {" más y el envio te sale gratis."}
                </span>
              ) : (
                <span>
                  Envío totalmente <strong>GRATIS</strong>.
                </span>
              )}
            </p>
          </div>

          <div className={styles.subtotal}>
            <h3>SUBTOTAL:</h3>
            <p>{`${total.toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })}`}</p>
          </div>

          <div className={styles.info}>
            <p>Gastos de envío y descuentos calculando al momento de pagar</p>
          </div>

          <div className={styles.buttons}>
            <button
              className={styles.boton_comprar}
              onClick={handleClickCarrito}
            >
              COMPRAR AHORA
            </button>

            <Link to={"../../carrito"} className={styles.link_boton_carrito}>
              <button className={styles.boton_ver_carrito}>VER CARRITO</button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
