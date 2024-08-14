import React, { useEffect, useState } from 'react'

// ESTILOS
import styles from "../../ui/styles/PopUpTallas.module.css";

// IMÁGENES
import { getSizeGuidByName } from '../helpers/getSizeGuides';

export const PopUpTallas = ({ tipo_media, showPopUpTallas, setShowPopUpTallas }) => {

  const [sizeGuide, setSizeGuide] = useState({})

  useEffect(() => {
    getSizeGuidByName(tipo_media).then( (data) => {
      setSizeGuide(data)
    })
  }, [])

  console.log(sizeGuide)

  return (
    <div className={ styles.container}>
        <div className={ styles.modal_content }>
          <span className={ styles.close_btn } onClick={() => setShowPopUpTallas(false)}>
            X
          </span>
          <img src={sizeGuide.image_url} alt={ sizeGuide.alt} />
        </div>
      </div>
  )
}
