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

export const Navbar = () => {
  const { cart } = useCart();
  const [cantidad, setCantidad] = useState(0);
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

  // console.log(selectedLink)
  // console.log(location)

  const handleLinkClick = (path) => {
    clearPack();
    setSelectedLink(path);
  };

  const condition = location[1] && location[1] === selectedLink

  console.log(condition)

  return (
    <header>
      <nav>
        <Link to="/" onClick={clearPack}>
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

          <Link>
            <img src={IconoCorazon} alt="Icono buscar" />
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
