import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Iconoso Navbar
import itsocks_logo from "../../assets/navbar/itsocks_logo.png";
import IconoBuscar from "../../assets/navbar/Icono-buscador.svg";
import IconoCorazon from "../../assets/navbar/mdi_cards-heart-outline.svg";
import IconoCarrito from "../../assets/navbar/Vector.svg";

import styles from "./../styles/Navbar.module.css";
import { useCart } from "../../hooks/useCart";
import { usePack } from "../../hooks/usePack";
import { useWish } from "../../hooks/useWish";

export const Navbar = () => {
  const { cart } = useCart();
  const { wish } = useWish();
  const [cantidad, setCantidad] = useState(0);
  const [cantidadWish, setCantidadWish] = useState(0);
  const { clearPack } = usePack()
  const [selectedLink, setSelectedLink] = useState(null);


  const location = useLocation().pathname.split("/");

  useEffect(() => {
    setCantidad(
      cart.reduce((acumulador, objeto) => {
        return acumulador + objeto.cantidad;
      }, 0)
    );
  }, [cart]);

  useEffect(() => {
    setCantidadWish(
      wish.reduce((acumulador, objeto) => {
        return acumulador + objeto.cantidad;
      }, 0)
    );
  }, [wish]);

  // console.log(selectedLink)
  // console.log(location)

  const handleLinkClick = (path) => {
    // clearPack();
    setSelectedLink(path);
  };

  const condition = location[1] && location[1] === selectedLink

  return (
    <header>
      <nav>
        <Link to="/">
          <picture>
            <img src={itsocks_logo} alt="ItSocks Logo" />
          </picture>
        </Link>

        <div className={styles.search_container}>
          <img src={IconoBuscar} alt="Icono buscar" />
          <input type="text" placeholder="Buscar en nuestro sitio" />
        </div>

        <div className={styles.link_container}>
          <Link 
            to="medias" 
            onClick={() => handleLinkClick("medias")}
            className={condition && selectedLink === 'medias' ? styles.selected : ""}
          >Medias</Link>
          <Link 
            to="accesorios" 
            onClick={() => handleLinkClick("accesorios")}
            className={condition && selectedLink === 'accesorios' ? styles.selected : ""}
          >Accesorios</Link>
          <Link 
            to="packs" 
            onClick={() => handleLinkClick("packs")}
            className={condition && selectedLink === 'packs'? styles.selected : ""}
          >Packs</Link>
          <Link 
            to="mas" 
            onClick={() => handleLinkClick("mas")}
            className={condition && selectedLink === 'mas'? styles.selected : ""}
          >Más</Link>

          <Link
            to={"lista_de_favoritos"}
          >
            
            <div className={styles.contenedor_contador}>
              <div className={styles.contador_carrito}>{cantidadWish}</div>
              <img src={IconoCorazon} alt="Lista deseados" />
            </div>
          </Link>

          <Link 
            to={"carrito"}
            onClick={() => handleLinkClick("carrito")}
            className={condition ? styles.selected : ""}
          >
            <div className={styles.contenedor_contador}>
              <div className={styles.contador_carrito}>{cantidad}</div>
              <img src={IconoCarrito} alt="Icono carrito" />
            </div>
          </Link>
        </div>
      </nav>
    </header>
  );
};
