import React, { useEffect, useState } from "react";

// Estilos
import styles from "../../ui/styles/PopUpCarrito.module.css";
import camion from "../../../public/assets/producto/camion.svg";
import x_popup_green from "../../../public/assets/producto/x_popup_green.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

export const PopUpCarrito = ({ title, product, showPopUp, setShowPopUp }) => {

  const navigate = useNavigate();
  const {pathname} = useLocation();
  const { subtractOneToCart, cart, addToCart } = useCart();

  const handleClickCarrito = () => {
    
    if( title === "CARRITO DE COMPRA" ){
      navigate("/carrito", { state: { previousPath: pathname } });
    }else{
      addToCart(product);
      navigate("/carrito", { state: { previousPath: pathname } });
    }
  };

  const handleCloseClick = () => {
    setShowPopUp(false);
  };
  
  const total = cart.reduce((acumulador, objeto) => {
    // Agregar una condición para filtrar elementos
    if (!objeto.name.toLowerCase().includes("pack")) {
      return acumulador + objeto.cantidad * objeto.price;
    } else {
      return acumulador + objeto.price; // No se suma al acumulador si no cumple la condición
    }
  }, 0);

  const delete_product = () => {
    subtractOneToCart(product);
    setShowPopUp(false);
  }

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
            <div 
              className={ styles.delete_product}
              onClick={ delete_product }
            >
              <img src={ x_popup_green } alt="Eliminar producto"/>
            </div>
          </div>

          <div className={styles.costo_envio}>
            <img src={camion} alt="Ícono camion" />

            <p>
              {total < 250000 ? (
                <>
                  Lleva{" "}
                  <strong>{`${(250000 - total).toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                  })} `}</strong>{" "}
                  {" más y el envío te sale gratis."}
                </>
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

            <Link 
              to={title == "CARRITO DE COMPRA" ?  "../../carrito" : "../../lista_de_favoritos"}
              state = {{previousPath: pathname}}
              className={styles.link_boton_carrito}
            >

              <button className={styles.boton_ver_carrito}>
                { title == "CARRITO DE COMPRA" ? "VER CARRITO": "VER LISTA DE DESEOS"}
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
