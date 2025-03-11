import React, { useEffect, useState } from "react";

import ScrollHorizontal from "../components/ScrollHorizontal";

import styles from "../../ui/styles/MediasSubcategory.module.css";
import { ScrollPersonalizadas } from "../components/ScrollPersonalizadas";

import { getContactInfo } from '../helpers/getContactInfo';

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

    {
      id: "t1",
      src: "../../../public/assets/medias/tipos/personalizadas/ejemplos/tobilleras/1.png",
      subcategory: "tobilleras",
      description: "Esta es una media",
    },
    {
      id: "t2",
      src: "../../../public/assets/medias/tipos/personalizadas/ejemplos/tobilleras/1.png",
      subcategory: "tobilleras",
      description: "Esta es una media",
    },
    {
      id: "t3",
      src: "../../../public/assets/medias/tipos/personalizadas/ejemplos/tobilleras/1.png",
      subcategory: "tobilleras",
      description: "Esta es una media",
    },
    {
      id: "t4",
      src: "../../../public/assets/medias/tipos/personalizadas/ejemplos/tobilleras/1.png",
      subcategory: "tobilleras",
      description: "Esta es una media",
    },
  ];



  const [ filteredImages, setFilteredImages ] = useState(images);

  const [contactInfo, setContactInfo] = useState({});
  
  // useEffect(() => {
  //     getContactInfo().then( data => {
  //         setContactInfo(data);
  //     }).catch( error => {
  //         console.log(error);
  //     })
  // }, []);


  useEffect(() => {
    setFilteredImages(images.filter( image => image.subcategory == subcategory.toLowerCase()));

    getContactInfo().then( data => {
        setContactInfo(data);
    }).catch( error => {
        console.log(error);
  })
  }, []);

  console.log(subcategory)
  return (
    <div className={styles.main}>
      <h1>{subcategory === 'Media_Cania' || subcategory === 'Pantorrilleras' ? `${subcategory.toUpperCase().replace('_', ' ').replace('CANIA', 'CAÑA')}` : `MEDIAS ${subcategory.toUpperCase()}`}</h1>
      <div className={styles.medias_container}>
        
        <ScrollPersonalizadas images={ filteredImages }/>
        <p className={ styles.negrita }>¿Te imaginas llevar medias únicas de tu equipo, con la carita de tu mascota o la imagen que más te gusta?</p>
        <p>
        Ahora es posible hacerlo realidad. Nuestro servicio te ofrece la oportunidad de personalizar tus medias completamente a tu gusto.
        </p>
        <p className={ styles.negrita }>¡Contáctanos para crear juntos tus medias soñadas!</p>
      </div>
      {
        contactInfo[0] && (
          <a 
            href={`https://api.whatsapp.com/send?phone=57${contactInfo[0]['whatsapp_number']}&text=Hola!%20Cordial%20saludo,%20estoy%20interesad@%20en%20comprar%20productos%20IT%20SOCKS%20personalizados%20en%20la%20categoría%20${subcategory.toUpperCase().replace('_', ' ').replace('CANIA', 'CAÑA')},%20me%20podrías%20dar%20más%20información%2E%20Gracias`} 
            target="_blank"
            className={styles.contact_us}
          >
            <button>¡Contáctanos!</button>
          </a>
        )
      }
      
    </div>
  );
};
