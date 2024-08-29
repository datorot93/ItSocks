import React, { useEffect, useState } from "react";

// IMÁGENES
import guia_tallas from "../../../public/assets/guia_tallas/guia_tallas.jpg";

// ESTILOS
import styles from "../../../src/ui/styles/GuiaTallas.module.css";
import { getSizeGuides } from "../helpers/getSizeGuides";

export const GuiaTallas = () => {

  const [imgTallas, setImgTallas] = useState([]);

  useEffect( () => {
    getSizeGuides().then( (data) => {
      setImgTallas(data)
    }).catch( (error) => {
      console.log(error)
    })
  }, [])


  return (
    <div className={styles.guia_tallas}>
      <h1>GUÍAS DE TALLAS</h1>
      {
        imgTallas.map( (imgTalla, index) => (
          <React.Fragment key={index}>
            <h2>{imgTalla.size_guide.toUpperCase()}</h2>
            <img src={imgTalla.image_url} alt={imgTalla.alt} />
          </React.Fragment>
        ))
      }
      {/* <img src={guia_tallas} alt="Guía de tallas"></img>; */}
    </div>
  );
};
