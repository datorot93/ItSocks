import React, { useEffect, useState } from "react";

// Estilos
import styles from "../../ui/styles/PopUpCarrito.module.css";
import camion from "../../../public/assets/producto/camion.svg";
import { Link, useNavigate } from "react-router-dom";

export const PackPopUpCarrito = ({
  title,
  product,
  showPopUp,
  setShowPopUp,
}) => {
  const handleClickCarrito = () => {
    console.log("Este es un mensaje temporal");
  };

  const handleCloseClick = () => {
    setShowPopUp(false);
  };

  const handleClickComprar = () => {
    useNavigate("");
  };
  // console.log("ESTE ES EL PRODUCTO DEL POPUP");
  // console.log(product);
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
              <img src={product.image_url} alt="Imagen producto" />
            </div>
            <div className={styles.product_description}>
              <p> {product.name + " " + product.color}</p>
              <div className={styles.price}>
                <p>{"$ " + product.price}</p>
              </div>
            </div>
          </div>

          <div className={styles.costo_envio}>
            <img src={camion} alt="Ícono camion" />

            <p>
              {"Lleva $"} <strong>{`${200000 - product.price} `}</strong>{" "}
              {" más y el envio te sale gratis"}
            </p>
          </div>

          <div className={styles.subtotal}>
            <h3>SUBTOTAL:</h3>
            <p>{`$ ${product.price}`}</p>
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
