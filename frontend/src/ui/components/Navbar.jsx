import React from 'react';
import { Link } from 'react-router-dom';

// Iconoso Navbar
import itsocks_logo from '../../assets/navbar/itsocks_logo.png';
import IconoBuscar from '../../assets/navbar/Icono-buscador.svg';
import IconoCorazon from '../../assets/navbar/mdi_cards-heart-outline.svg';
import IconoCarrito from '../../assets/navbar/Vector.svg';

import styles from './../styles/Navbar.module.css';


export const Navbar = () => {
  return (
    <header>
      <nav>
        <Link to="/">
          <picture>
            <img src={ itsocks_logo } alt="ItSocks Logo" />
          </picture>
        </Link>

        <div className={ styles.search_container }>
          <img src={ IconoBuscar } alt="Icono buscar"/>
          <input type="text" placeholder="Buscar en nuestro sitio"/>
        </div>

        <div className={ styles.link_container}>
          <Link           
              to="medias"
          >
              Medias
          </Link>
          <Link           
              to="accesorios"
          >
              Accesorios
          </Link>
          <Link
            to="packs"
          >
            Packs
          </Link>
          <Link
            
          >
            Más
          </Link>

          <img src={ IconoCorazon } alt="Icono buscar"/>
          
          <img src={ IconoCarrito } alt="Icono carrito"/>
          
        </div>
      </nav>
    </header>
  )
}
