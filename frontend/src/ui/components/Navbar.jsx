import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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


  useEffect(() => {
    setCantidad(
      cart.reduce((acumulador, objeto) => {
        return acumulador + objeto.cantidad;
      }, 0)
    );
  }, [cart]);

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
          <Link to="medias" onClick={clearPack}>Medias</Link>
          <Link to="accesorios"onClick={clearPack}>Accesorios</Link>
          <Link to="packs"onClick={clearPack}>Packs</Link>
          <Link to="mas"onClick={clearPack}>Más</Link>

          <Link>
            <img src={IconoCorazon} alt="Icono buscar" />
          </Link>

          <Link to={"carrito"} onClick={clearPack}>
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
