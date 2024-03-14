import React from 'react'

// ESTILOS
import styles from "../../ui/styles/PopUpTallas.module.css";

// IMÁGENES
import tallas_media from '../../../public/assets/guia_tallas/tallas_largas.png'
import tallas_canguros from '../../../public/assets/guia_tallas/tallas_canguros.png'
import tallas_pantorrilleras from '../../../public/assets/guia_tallas/tallas_pantorrilleras.png'

export const PopUpTallas = ({ tipo_media, showPopUpTallas, setShowPopUpTallas }) => {

  console.log(tipo_media)

  const popUp = {
    "pantorrilleras": tallas_pantorrilleras,
    "largas": tallas_media,
    "media caña": tallas_media,
    "canguros": tallas_canguros
  }

  return (
    <div className={ styles.container}>
        <div className={ styles.modal_content }>
          <span className={ styles.close_btn } onClick={() => setShowPopUpTallas(false)}>
            X
          </span>
          <img src={popUp[tipo_media.toLowerCase()]} alt={`talla ${tipo_media}`} />
        </div>
      </div>
  )
}
