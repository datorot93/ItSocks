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
import { getProductExtraInfo } from "../../helpers/getProductsByCategory";
import { PopUpTallas } from "../PopUpTallas";
import { useDispatch } from "react-redux";

export const PackProductDescription = () => {

  const dispatch = useDispatch();
  const { addPackToCart, cart } = useCart();

  const total = cart.reduce((acumulador, objeto) => {
    // Agregar una condición para filtrar elementos
    if (!objeto.name.toLowerCase().includes("pack")) {
      // console.log("Entré");
      return acumulador + objeto.cantidad * objeto.price;
    } else {
      // console.log("No entré");
      return acumulador + objeto.price; // No se suma al acumulador si no cumple la condición
    }
  }, 0);

  useEffect(() => {
    // Scroll hacia arriba al cargar la página
    window.scrollTo(0, 0);
  },[]);

  const navigate = useNavigate();
  const { pack, addToPack } = usePack();

  const [currentProduct, setCurrentProduct] = useState(
    JSON.parse(localStorage.getItem("current_product"))
  );

  const [selectedIndex, setSelectedIdenx] = useState(0);

  const product = localStorage.getItem("current_product");
  const producto = JSON.parse(product);

  const [tallas, setTallas] = useState([]);

  // Petición de colores y tallas del producto
  useEffect(() => {
    const getColorsAndSizes = async () => {
      const extra_info = await getProductExtraInfo(producto.name, producto.type);
      setTallas(extra_info[0].size);
    };
    getColorsAndSizes();
  }, []);

  const [tallaSeleccionada, setTallaSeleccionada] = useState(null);

  const handleTallaClick = (talla) => {
    setTallaSeleccionada(talla);
  };

  const initialState = Object.keys(producto.images).slice(
    1,
    Object.keys(producto.images).length
  );

  // States
  const [otherPhotos, setOtherPhotos] = useState(initialState);
  const [cantProducts, setCantProducts] = useState(1);
  const [showPopTallas, setShowPopUpTallas] = useState(false);

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

  // HANDLES
  const handleAgregarSeleccionado = () => {
    if (pack.product_quantity - pack.prductos.length === 0 || pack.product_quantity - pack.prductos.length === 1 || cantProducts + pack.prductos.length == pack.product_quantity) {
      let temp_product_list = []
      for (let index = 0; index < cantProducts; index++) {
        temp_product_list.push({ 
          ...currentProduct, 
          cantidad: 1,
          selected_size: tallaSeleccionada
        })
        addToPack(
          { 
            ...currentProduct, 
            cantidad: 1,
            selected_size: tallaSeleccionada
          })

      }
      console.log(pack.prductos)
      // console.log(console.log(JSON.parse(localStorage.getItem("pack"))));
      addPackToCart({ ...pack, cantidad: 1, prductos: [...pack.prductos, ...temp_product_list]});
      // addPackToCart({ ...pack, cantidad: 1, prductos: [...pack.prductos, {...currentProduct, cantidad: 1, selected_size: tallaSeleccionada}]});
      navigate("/carrito");
    } else if (cantProducts > 0) {
      for (let index = 0; index < cantProducts; index++) {
        addToPack({ 
          ...currentProduct, 
          cantidad: 1,
          selected_size: tallaSeleccionada
        });
      }
      navigate(-1)
    }
    
  };

  const handleShowPopUp = (title) => {
    if (cantProducts > 0) {
      if(tallaSeleccionada){
        if (title === "carrito") {
          setTitle("Carrito de compras");
          addPackToCart({ ...pack, cantidad: 1 });
        } else {
          setTitle("Lista de regalos");
        }
        setShowPopUp(true);
      }
    }
  };

  // console.log(Boolean(tallaSeleccionada));
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
              {tallas.map((talla) => (
                <div 
                  className={`${styles.talla_button} ${tallaSeleccionada === talla ? styles.talla_selected : ''}`} 
                  key={talla}
                  onClick={ () => handleTallaClick(talla)}
                >
                  {talla}
                </div>
              ))}
            </div>
          </div>

          <div 
            className={styles.guia_tallas}
            onClick={() => setShowPopUpTallas(true)}
          >
              <span>¡Consulta la guia de tallas!</span>
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
                
                onClick={() =>
                  setCantProducts(
                    cantProducts > 1 ? cantProducts - 1 : cantProducts
                  )
                }
                className={styles.button_left}
              >
                -
              </button>
              <span>{cantProducts}</span>
              <button
                className={styles.button_right}
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
              className={`${styles.boton_comprar} ${tallaSeleccionada ? '' : styles.boton_comprar_disabled}`}
              onClick={handleAgregarSeleccionado}
              disabled={tallaSeleccionada ? false : true}
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

      {
        showPopTallas && (
          <PopUpTallas
            tipo_media={producto.type}
            showPopUpTallas={showPopTallas}
            setShowPopUpTallas={setShowPopUpTallas}
          />
        )
      }
    </div>
  );
};
