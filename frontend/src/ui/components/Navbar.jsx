import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Iconoso Navbar
import itsocks_logo from "../../assets/navbar/itsocks_logo.png";
import IconoBuscar from "../../assets/navbar/Icono-buscador.svg";
import IconoCorazon from "../../assets/navbar/mdi_cards-heart-outline.svg";
import IconoCarrito from "../../assets/navbar/Vector.svg";
import burguerMenu from "../../assets/navbar/burguer_menu.svg";
import xCircle from "../../assets/navbar/x_circle.svg";

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
  const [input, setInput] = useState("")
  const [toSearch, setToSearch] = useState(false)

  const [ showMobileMenu, setShowMobileMenu ] = useState(false)


  const location = useLocation().pathname.split("/");
  const {pathname} = useLocation();
  const navigate = useNavigate();
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

  const handleChangeSearch = (event) => {
    setInput(event.target.value)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      navigate(`search?input=${input}`)
    }
  }


  const handleLinkClick = (path) => {
    // clearPack();
    setInput("")
    setSelectedLink(path);
    setShowMobileMenu(false)
  };

  const handleMobilMenu = () => {
    setShowMobileMenu(!showMobileMenu)
  }

  const handleSearch = () => {
    setToSearch(!toSearch)
  }

  console.log(toSearch)

  const condition = location[1] && location[1] === selectedLink

  return (
    <header>
      <nav className={ styles.nav_container}>

        <div className={`${styles.burguer_container} ${styles.elemento}`} onClick={ handleMobilMenu }>
          <img src={burguerMenu} alt="Burguer Menu" />
        </div>

        <Link 
          to="/"
          onClick={() => setInput("")}
          className={`${styles.logo_container} ${styles.elemento}`}
        >
          <picture>
            <img src={itsocks_logo} alt="ItSocks Logo" />
          </picture>
        </Link>

        <div className={`${styles.search_container} ${styles.elemento}`}>
          <Link
            to={ input.length > 2 ? `search?input=${input}` : ``}
          >
            <img 
              src={IconoBuscar} alt="Icono buscar"
              onClick={ handleSearch }
            />
          </Link>
          <input 
            type="text"
            value={input}
            placeholder="Buscar en nuestro sitio"
            onChange={ handleChangeSearch }
            onKeyDown={handleKeyDown}
            className={ toSearch ? `${styles.input_search} ${ styles.visible}` : `${styles.input_search} ${styles.hiddlen}`}
          />
        </div>

        
          <div className={ showMobileMenu ? `${styles.link_container} ${styles.visible} ${styles.elemento}`: `${styles.link_container} ${styles.elemento}`}>
            <div className={styles.x_circle} onClick={ handleMobilMenu}>
              <img src={xCircle} alt="Cerrar Menu" />
            </div>
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

            
          </div>
        
        <div
          className={ `${styles.elemento} ${ styles.carrito_lista}`}
        >
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
              state={{previousPath: pathname}}
              onClick={() => handleLinkClick("carrito")}
              className={condition ? `${styles.selected} ${styles.elemento}` : styles.elemento}
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
