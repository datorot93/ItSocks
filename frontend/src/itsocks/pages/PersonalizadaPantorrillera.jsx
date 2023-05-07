import React from "react";

import { CarruselProductos } from "../components/CarruselProductos";

import styles from "../../ui/styles/MediasSubcategory.module.css";

export const PersonalizadaPantorrillera = () => {
  return (
    <div className={styles.main}>
      <h1>Medias Pantorrilleras</h1>
      <div className={styles.medias_container}>
        <CarruselProductos />
        <p>
          ¿Quieres destacar como equipo y lucir increíble mientras lo haces?
          Nuestras medias personalizadas con diseños exclusivos son la
          respuesta. Ya sea que seas un equipo deportivo buscando un toque extra
          de estilo, o simplemente alguien que quiere darle a sus pies un toque
          de personalidad, ¡nosotros tenemos lo que necesitas! Con una amplia
          variedad de diseños y patrones para elegir, puedes estar seguro de que
          tus medias serán únicas y reflejarán la esencia de tu equipo. ¡Obtén
          tus medias personalizadas hoy mismo y lleva tu juego al siguiente
          nivel!
        </p>
      </div>
      <button>¡¡Contáctanos!!</button>
    </div>
  );
};
