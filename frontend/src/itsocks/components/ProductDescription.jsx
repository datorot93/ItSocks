// React
import React, { useEffect, useState } from "react";

// Estilos
import styles from "../../ui/styles/ProductDescription.module.css";

// Utilidades
import { getProductsByPartOfName } from "../helpers/getProductsByPartOfName";
import { LazyLoadImage } from "react-lazy-load-image-component";

// Imágenes
import carrito from "../../../public/assets/producto/carrito.svg";
import corazon from "../../../public/assets/producto/corazon.svg";
import camion from "../../../public/assets/producto/camion.svg";
import reloj from "../../../public/assets/producto/reloj.svg";

import { colores } from "../types/types";

import { PopUpCarrito } from "./PopUpCarrito";
import { useCart } from "../../hooks/useCart";
import { getProductExtraInfo, getProductsByDesign } from "../helpers/getProductsByCategory";
import { useLocation, useNavigate } from "react-router-dom";
import { PopUpTallas } from "./PopUpTallas";
import { ProductosSimilares } from "./products/ProductosSimilares";
import ScrollHorizontal from "./ScrollHorizontal";
import { useWish } from "../../hooks/useWish";

// React Reducx

export const ProductDescription = () => {

  const {pathname} = useLocation();
  useEffect(() => {
    // Scroll hacia arriba al cargar la página
    window.scrollTo(0, 0);
  }, []);
  
  const { addToCart, removeFromCart, cart } = useCart();
  const { addToWish, removeFromWish, wish } = useWish();

  const total = cart.reduce((acumulador, objeto) => {
    // Agregar una condición para filtrar elementos
    if (!objeto.name.toLowerCase().includes("pack")) {

      return acumulador + objeto.cantidad * objeto.price;
    } else {

      return acumulador + objeto.price; // No se suma al acumulador si no cumple la condición
    }
  }, 0);

  // console.log(total)

  const [selectedIndex, setSelectedIdenx] = useState(0);
  const navigate = useNavigate();

  const product = localStorage.getItem("current_product");
  const producto = JSON.parse(product);

  const [colors, setColors] = useState([]);
  const [tallas, setTallas] = useState([]);

  const similares = getProductsByPartOfName(producto.name);

  const initialState = Object.keys(producto.images).slice(
    1,
    Object.keys(producto.images).length
  );

  const [ simirlarProducts, setSimirlarProducts] = useState([])

  // Petición de colores y tallas del producto
  useEffect(() => {
    const getColorsAndSizes = async () => {
      const extra_info = await getProductExtraInfo(producto.name, producto.type);
      console.log(extra_info)
      setColors(extra_info[0].colores);
      setTallas(extra_info[0].size);
    };
    getColorsAndSizes();
    getProductsByDesign(producto.design).then(
      res => setSimirlarProducts([...res])
    ).catch( err => console.log(err))
  }, []);

  // console.log(simirlarProducts)

  // States
  const [otherPhotos, setOtherPhotos] = useState(initialState);
  const [cantProducts, setCantProducts] = useState(1);

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
  const [showPopTallas, setShowPopUpTallas] = useState(false);

  const [title, setTitle] = useState("");

  const [product_to_add, setProduct_to_add] = useState({});

  useEffect(() => {
    if(title === "CARRITO DE COMPRA"){
      addToCart(product_to_add);
      setShowPopUp(true);
      setCantProducts(1);
      setTallaSeleccionada(null);
      setColorSeleccionado(null);
    }else if(title === "LISTA DE DESEOS"){
      addToWish(product_to_add);
      setShowPopUp(true);
      setCantProducts(1);
      setTallaSeleccionada(null);
      setColorSeleccionado(null);
    }else if (title === "COMPRAR AHORA"){
      addToCart(product_to_add);
      setCantProducts(1);
      setTallaSeleccionada(null);
      setColorSeleccionado(null);
    }
  }, [product_to_add, title]);

  const handleShowPopUp = (title) => {
    if (cantProducts > 0) {
      if(tallas[0] && tallas[0] !== "unica"){
        if(tallaSeleccionada){
          if (title === "carrito") {
            setTitle("CARRITO DE COMPRA");
            setProduct_to_add({ 
              ...producto, 
              cantidad: cantProducts,
              selected_color: '',
              selected_size: tallaSeleccionada
            });

          } else {
            setTitle("LISTA DE DESEOS");
            setProduct_to_add({ 
              ...producto, 
              cantidad: cantProducts,
              selected_color: '',
              selected_size: tallaSeleccionada
            });

            
          }

        }
      }else if(colors.length > 0){
        if(colorSeleccionado){
          if (title === "carrito") {
            setTitle("CARRITO DE COMPRA");
            setProduct_to_add({ 
              ...producto, 
              cantidad: cantProducts,
              selected_size: '',
              selected_color: colorSeleccionado 
            });

          } else {
            setTitle("LISTA DE DESEOS");
            setProduct_to_add({ 
              ...producto, 
              cantidad: cantProducts,
              selected_size: '',
              selected_color: colorSeleccionado 
            });

          }

        }

      }else if(tallas[0] === 'unica' && colors.length === 0){
        if (title === "carrito") {
          setTitle("CARRITO DE COMPRA");
          setProduct_to_add({ 
            ...producto, 
            cantidad: cantProducts,
            selected_size: '',
            selected_color: ''
          });


        } else {
          setTitle("LISTA DE DESEOS");
          setProduct_to_add({ 
            ...producto, 
            cantidad: cantProducts,
            selected_size: '',
            selected_color: ''
          });


        }
      }
    }
  };

  const handleComprarAhora = () => {
    if(cantProducts > 0 ){
      if(tallas[0] && tallas[0] !== "unica"){
        if(tallaSeleccionada){
          console.log('ENTRÉ AQUI 1')
          setProduct_to_add({ 
            ...producto, 
            cantidad: cantProducts,
            selected_color: '',
            selected_size: tallaSeleccionada
          });
          let product = {
            ...producto, 
            cantidad: cantProducts,
            selected_color: '',
            selected_size: tallaSeleccionada
          }
          setTitle('COMPRAR AHORA')
          addToCart(product);
          // if(Object.keys(product_to_add).length > 0){
          //   console.log('ENTRÉ AQUI 2')
          // }
          navigate("/carrito", {state:{previousPath: pathname}});
        }else {
          alert('Debes seleccionar una talla')
        }
      }else if(colors.length > 0){
        if(colorSeleccionado){
          setProduct_to_add({ 
            ...producto, 
            cantidad: cantProducts,
            selected_color: colorSeleccionado,
            selected_size: ''
          });
          let product = {
            ...producto, 
            cantidad: cantProducts,
            selected_color: '',
            selected_size: tallaSeleccionada
          }
          setTitle('COMPRAR AHORA')
          addToCart(product);
          
          // if(Object.keys(product_to_add).length > 0){
          //   addToCart(product_to_add);
          // }
          navigate("/carrito", {state:{previousPath: pathname}});
        }else {
          alert('Debes seleccionar un color')
        }      
      }else if(tallas[0] === 'unica' && colors.length === 0){
        console.log('ENTRÉ AQUI 3')
        
        setProduct_to_add({ 
          ...producto, 
          cantidad: cantProducts,
          selected_color: '',
          selected_size: ''
        });

        let product = {
          ...producto, 
          cantidad: cantProducts,
          selected_color: '',
          selected_size: tallaSeleccionada
        }
        setTitle('COMPRAR AHORA')
        addToCart(product);
        // if(Object.keys(product_to_add).length > 0){
        //   addToCart(product_to_add);
        // }
        navigate("/carrito", {state:{previousPath: pathname}});

      }
    }
  }

  // TALLAS
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null);
  const [colorSeleccionado, setColorSeleccionado] = useState(null);

  const handleTallaClick = (talla) => {
    setTallaSeleccionada(talla);
  };
  const handleColorClick = (color) => {
    setColorSeleccionado(color);
  };

  return (
    <>
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
            <div className={ styles.title }>
              <h2>{producto.name}</h2>
            </div>
            <div className={styles.precio}>
              {producto.discount === 0 ? (
                <p>{`${producto.price.toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                })}`}</p>
              ) : (
                <>
                  <p
                    className={styles.porcentaje_descuento}
                  >{`${producto.discount}% OFF`}</p>
                  <p
                    className={styles.precio_sin_descuento}
                  >{`${producto.price.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                  })}`}</p>
                  <p>{`${(
                    producto.price -
                    producto.price * (producto.discount / 100)
                  ).toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                  })}`}</p>
                </>
              )}
            </div>
            <div className={styles.description_p}>
              <p>{producto.description}</p>
            </div>


            {tallas[0] && tallas[0] !== "unica" ? (
              <>
                <div 
                  className={styles.guia_tallas}
                  onClick={() => setShowPopUpTallas(true)}
                >
                    <span>¡Consulta la guia de tallas!</span>
                </div>
                <div className={styles.tallas}>
                <div className={styles.tallas_label}>Tallas: </div>
                <div className={styles.numeros_tallas}>
                  {tallas.map((talla) => (
                    <div 
                      className={`${styles.talla_button} ${tallaSeleccionada === talla ? styles.talla_selected : ''}`} 
                      key={talla}
                      onClick={() => handleTallaClick(talla)}
                    >
                      {talla}
                    </div>
                  ))}
                </div>
              </div>
              </>

            ) : (
              <></>
            )}

            {colors.length > 0 ? (
              <div className={styles.colores}>
                <div className={styles.colores_label}>Colores: </div>
                <div className={styles.numeros_colores}>
                  {colors.map((color) => (
                    <div
                      className={`${styles.color_circle} ${colorSeleccionado === color ? styles.color_selected : ''}}`}
                      style={{
                        backgroundColor: colores[color.toUpperCase()],
                      }}
                      key={color}
                      onClick={() => handleColorClick(color)}
                    ></div>
                  ))}
                </div>
              </div>
            ) : (
              <></>
            )}

            <div className={styles.acciones}>
              <div
                className={styles.carrito}
                onClick={() => handleShowPopUp("carrito")}
              >
                <img src={carrito} alt="Carrito de compras" />
                <span>Agregar a carrito</span>
              </div>
              <div
                className={styles.corazon}
                onClick={() => handleShowPopUp("deseos")}
              >
                <img src={corazon} alt="Corazon" />
                <span>Añadir a mi lista</span>
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
                  onClick={() => setCantProducts(cantProducts + 1)}
                  className={styles.button_right}
                >
                  +
                </button>
              </div>
              <button 
                className={styles.boton_comprar}
                onClick={ handleComprarAhora }
              >¡¡COMPRAR AHORA!!
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
          <PopUpCarrito
            title={title}
            product={product_to_add}
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
      <div className={ styles.title_recomendados}>
        <h2>Productos recomendados 🔥</h2>
      </div>
      <ScrollHorizontal masVendidos={simirlarProducts}/>

    </>
  );
};
