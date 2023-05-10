import React from "react";

import { ScrollHorizontal } from "../components/ScrollHorizontal";

import styles from "../../ui/styles/MediasSubcategory.module.css";

export const PersonalizadaPantorrillera = () => {

  const images = [
    {
      id: "p1",
      src: "../../../public/assets/medias/productos/p1.png",
      description: "Esta es una media",
    },
    {
      id: "p2",
      src: "../../../public/assets/medias/productos/p2.png",
      description: "Esta es una media",
    },
    {
      id: "p3",
      src: "../../../public/assets/medias/productos/p3.png",
      description: "Esta es una media",
    },
    {
      id: "p4",
      src: "../../../public/assets/medias/productos/p4.png",
      description: "Esta es una media",
    },
    {
      id: "p5",
      src: "../../../public/assets/medias/productos/p5.png",
      description: "Esta es una media",
    },
  ];

  return (
    <div className={styles.main}>
      <h1>Medias Pantorrilleras</h1>
      <div className={styles.medias_container}>
        
        <ScrollHorizontal images={ images }/>
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
