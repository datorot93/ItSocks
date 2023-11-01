import React from "react";

// IMÁGENES
import guia_tallas from "../../../public/assets/guia_tallas/guia_tallas.jpeg";

// ESTILOS
import styles from "../../../src/ui/styles/GuiaTallas.module.css";

export const GuiaTallas = () => {
  return (
    <div className={styles.guia_tallas}>
      <img src={guia_tallas} alt="Guía de tallas"></img>;
    </div>
  );
};
