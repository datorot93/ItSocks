import React, { useEffect, useState } from "react";

import ScrollHorizontal from "../components/ScrollHorizontal";

import styles from "../../ui/styles/MediasSubcategory.module.css";
import { ScrollPersonalizadas } from "../components/ScrollPersonalizadas";

export const PersonalizadaPantorrillera = ({ subcategory }) => {

  const images = [
    {
      id: "p1",
      src: "../../../public/assets/medias/tipos/personalizadas/ejemplos/pantorrilleras/1.png",
      subcategory: "pantorrilleras",
      description: "Esta es una media",
    },
    {
      id: "p2",
      src: "../../../public/assets/medias/tipos/personalizadas/ejemplos/pantorrilleras/2.png",
      subcategory: "pantorrilleras",
      description: "Esta es una media",
    },
    {
      id: "p3",
      src: "../../../public/assets/medias/tipos/personalizadas/ejemplos/pantorrilleras/3.png",
      subcategory: "pantorrilleras",
      description: "Esta es una media",
    },
    {
      id: "p4",
      src: "../../../public/assets/medias/tipos/personalizadas/ejemplos/pantorrilleras/4.png",
      subcategory: "pantorrilleras",
      description: "Esta es una media",
    },
    {
      id: "l1",
      src: "../../../public/assets/medias/tipos/personalizadas/ejemplos/largas/1.png",
      subcategory: "largas",
      description: "Esta es una media",
    },
    {
      id: "l2",
      src: "../../../public/assets/medias/tipos/personalizadas/ejemplos/largas/2.png",
      subcategory: "largas",
      description: "Esta es una media",
    },
    {
      id: "l3",
      src: "../../../public/assets/medias/tipos/personalizadas/ejemplos/largas/3.png",
      subcategory: "largas",
      description: "Esta es una media",
    },
    {
      id: "l4",
      src: "../../../public/assets/medias/tipos/personalizadas/ejemplos/largas/4.png",
      subcategory: "largas",
      description: "Esta es una media",
    },
    {
      id: "mc1",
      src: "../../../public/assets/medias/tipos/personalizadas/ejemplos/media_cania/1.png",
      subcategory: "media_cania",
      description: "Esta es una media",
    },
    {
      id: "mc2",
      src: "../../../public/assets/medias/tipos/personalizadas/ejemplos/media_cania/2.png",
      subcategory: "media_cania",
      description: "Esta es una media",
    },
    {
      id: "mc3",
      src: "../../../public/assets/medias/tipos/personalizadas/ejemplos/media_cania/3.png",
      subcategory: "media_cania",
      description: "Esta es una media",
    },
    {
      id: "mc4",
      src: "../../../public/assets/medias/tipos/personalizadas/ejemplos/media_cania/4.png",
      subcategory: "media_cania",
      description: "Esta es una media",
    },
  ];

  console.log(subcategory)

  const [ filteredImages, setFilteredImages ] = useState(images);

  useEffect(() => {
    setFilteredImages(images.filter( image => image.subcategory == subcategory.toLowerCase()));
  }, []);

  return (
    <div className={styles.main}>
      <h1>{ `${subcategory.toUpperCase().replace('_', ' ').replace('CANIA', 'CAÑA')} PERSONALIZADAS` }</h1>
      <div className={styles.medias_container}>
        
        <ScrollPersonalizadas images={ filteredImages }/>
        <p><strong>¿Te imaginas llevar medias únicas de tu equipo, con la carita de tu mascota o la imagen que más te gusta? </strong></p>
        <p>
        Ahora es posible hacerlo realidad. Nuestro servicio te ofrece la oportunidad de personalizar tus medias completamente a tu gusto.
        </p>
        <p><strong>¡Cóntáctanos para crear juntos tus medias soñadas!</strong></p>
      </div>
      <a 
        href={`https://api.whatsapp.com/send?phone=573143939837&text=Hola!%20Cordial%20saludo,%20estoy%20interesad@%20en%20comprar%20productos%20IT%20SOCKS%20personalizados%20en%20la%20categoría%20${subcategory.toUpperCase().replace('_', ' ').replace('CANIA', 'CAÑA')},%20me%20podrías%20dar%20más%20información%2E%20Gracias`} 
        target="_blank"
        className={styles.contact_us}
      >
        <button>¡Contáctanos!</button>
      </a>
      
    </div>
  );
};
