import React from 'react'

import styles from '../../ui/styles/HomePage.module.css';
import { Slider2 } from '../components/Slider2';
import { CarruselProductos } from '../components/CarruselProductos';

export const ItSocks = () => {
  return (
    <section>
      <CarruselProductos />

      <h2>Los productos más vendidos</h2>
      <p>Acá van las imágenes</p>
      <h2>Estilos de vida</h2>
      <p>Acá van las imágenes</p>
      <h2>Beneficios de nuestras medias</h2>
      <p>Acá va el video</p>
      <h2>Que piensan nuestros clientes</h2>
      <p>Acá van imágenes circulares de los perfiles de los clientes con la descripción abajo de estas</p>
    </section>
  )
}
