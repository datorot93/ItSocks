// React
import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

// Estilos
import styles from "../../../ui/styles/ProductDescription.module.css";

// Utilidades
import icono_regalo from "../../../../public/assets/packs/icono_regalo.png";

// import { getProductsByName } from '../helpers/getProductByName'
import { getProductsByPartOfName } from "../../helpers/getProductsByPartOfName";
import { LazyLoadImage } from "react-lazy-load-image-component";

// Imágenes
import carrito from "../../../../public/assets/producto/carrito.svg";
import camion from "../../../../public/assets/producto/camion.svg";
import reloj from "../../../../public/assets/producto/reloj.svg";
import { usePack } from "../../../hooks/usePack";
import { useCart } from "../../../hooks/useCart";
import { PopUpCarritoPack } from "./PopUpCarritoPack";

export const PackProductDescription = () => {
  const { addToCart, removeFromCart, cart } = useCart();

  const total = cart.reduce((acumulador, objeto) => {
    // Agregar una condición para filtrar elementos
    if (Object.keys(objeto).length == 12) {
      return acumulador + objeto.cantidad * objeto.price;
    } else {
      return acumulador + objeto.price; // No se suma al acumulador si no cumple la condición
    }
  }, 0);

  const navigate = useNavigate();
  const { pack, addToPack } = usePack();

  const [currentProduct, setCurrentProduct] = useState(
    JSON.parse(localStorage.getItem("current_product"))
  );

  const [selectedIndex, setSelectedIdenx] = useState(0);

  const product = localStorage.getItem("current_product");
  const producto = JSON.parse(product);

  const similares = getProductsByPartOfName(producto.name);

  const initialState = Object.keys(producto.images).slice(
    1,
    Object.keys(producto.images).length
  );

  // States
  const [otherPhotos, setOtherPhotos] = useState(initialState);
  const [cantProducts, setCantProducts] = useState(0);

  const next = () => {
    const condition = selectedIndex < Object.keys(producto.images).length - 1;
    const nextIndex = condition ? selectedIndex + 1 : 0;
    setSelectedIdenx(nextIndex);
    setOtherPhotos(
      Object.keys(producto.images).filter(
        (image) => image != Object.keys(producto.images)[nextIndex]
      )
    );
  };

  const previus = () => {
    const condition = selectedIndex > 0;
    const nextIndex = condition
      ? selectedIndex - 1
      : Object.keys(producto.images).length - 1;
    setSelectedIdenx(nextIndex);
    setOtherPhotos(
      Object.keys(producto.images).filter(
        (image) => image != Object.keys(producto.images)[nextIndex]
      )
    );
  };

  const [showPopUp, setShowPopUp] = useState(false);
  const [title, setTitle] = useState("");

  const handleGoBack = () => {
    navigate(-1);
  };

  console.log(cantProducts);

  // HANDLES
  const handleAgregarSeleccionado = () => {
    if (pack.product_quantity - pack.prductos.length === 0) {
      navigate("/carrito");
    } else if (cantProducts > 0) {
      for (let index = 0; index < cantProducts; index++) {
        addToPack({ ...currentProduct, cantidad: 1 });
      }
    }
  };

  const handleShowPopUp = (title) => {
    if (cantProducts > 0) {
      if (title === "carrito") {
        setTitle("Carrito de compras");
        const product_to_add = { ...producto, cantidad: 1 };
        addToCart({ ...pack, cantidad: 1 });
      } else {
        setTitle("Lista de regalos");
      }
      setShowPopUp(true);
    }
  };

  console.log(pack);
  return (
    <div className={styles.main}>
      {showPopUp ? <div className={styles.block_page}></div> : <></>}
      <div className={styles.description_container}>
        <div className={styles.image_container}>
          <div className={styles.principal_image}>
            <button
              className={`${styles.arrow_button} ${styles.left}`}
              onClick={previus}
            >
              {"<"}
            </button>
            <LazyLoadImage
              src={producto.images[Object.keys(producto.images)[selectedIndex]]}
              alt={producto.name}
            />
            <button
              className={`${styles.arrow_button} ${styles.right}`}
              onClick={next}
            >
              {">"}
            </button>
          </div>
          <div className={styles.similares}>
            {otherPhotos.map((image, index) => (
              <LazyLoadImage
                src={producto.images[image]}
                alt={producto.name}
                key={index}
              />
            ))}
          </div>
        </div>

        <div className={styles.description}>
          <h2>{producto.name}</h2>
          <div className={styles.precio}>
            <p>{`${producto.price.toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })}`}</p>
          </div>
          <div className={styles.description_p}>
            <p>{producto.description}</p>
          </div>

          {/* TALLAS */}
          <div className={styles.tallas}>
            <div className={styles.tallas_label}>Tallas: </div>
            <div className={styles.numeros_tallas}>
              {["8-10", "9-11", "10-12"].map((talla) => (
                <div className={styles.talla_button} key={talla}>
                  {talla}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.guia_tallas}>
            <Link to={"/guia_tallas"}>
              <span>¡Consulta tu guia de talla!</span>
            </Link>
          </div>

          <div className={styles.cantidad_packs}>
            <img src={icono_regalo} alt="" />
            <span>
              Productos seleccionados {pack["prductos"].length}/
              {pack["product_quantity"]}{" "}
            </span>
          </div>
          <div className={styles.agregar_carrito_container}>
            <div className={styles.regresar_catalogo} onClick={handleGoBack}>
              <span>REGRESAR AL CATALOGO</span>
            </div>
            <div
              className={styles.carrito}
              onClick={() => handleShowPopUp("carrito")}
            >
              {pack.product_quantity - pack.prductos.length === 0 ? (
                <>
                  <img src={carrito} alt="Carrito de compras" />
                  <span>Agregar a carrito</span>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className={styles.comprar}>
            <div className={styles.conteo}>
              <button
                className={styles.minus_button}
                onClick={() =>
                  setCantProducts(
                    cantProducts > 0 ? cantProducts - 1 : cantProducts
                  )
                }
              >
                -
              </button>
              <span>{cantProducts}</span>
              <button
                className={styles.plus_button}
                onClick={() =>
                  setCantProducts(
                    cantProducts < pack.product_quantity - pack.prductos.length
                      ? cantProducts + 1
                      : cantProducts
                  )
                }
              >
                +
              </button>
            </div>
            <button
              className={styles.boton_comprar}
              onClick={handleAgregarSeleccionado}
            >
              {pack.product_quantity - pack.prductos.length === 0
                ? "COMPRAR AHORA"
                : "AÑADIR A MI SELECCIÓN"}
            </button>
          </div>

          <div className={styles.tiempo_estimado}>
            <img src={reloj} alt="Reloj" />
            <p>
              Tiempos de envío: 3 a 4 días hábiles después del pago + 1 o 2 días
              que demora la transportadora en entregar
            </p>
          </div>

          <div className={styles.informacion_adicional}>
            <img src={camion} alt="Envíos" />
            {total < 250000 ? (
              <p>
                Lleva{" "}
                <span>{`${(250000 - total).toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                })}`}</span>{" "}
                más y el envío te sale gratis
              </p>
            ) : (
              <p>
                Envío totalmente <strong>GRATIS</strong>.
              </p>
            )}
          </div>
        </div>
      </div>
      {showPopUp && (
        <PopUpCarritoPack
          title={title}
          product={producto}
          showPopUp={showPopUp}
          setShowPopUp={setShowPopUp}
        />
      )}
    </div>
  );
};
