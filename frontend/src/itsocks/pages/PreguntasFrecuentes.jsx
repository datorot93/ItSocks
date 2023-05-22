// React
import React from 'react';

// Componentes
import { Pregunta } from '../components/Pregunta';

// Estilos
import styles from '../../ui/styles/PreguntasFrecuentes.module.css';

export const PreguntasFrecuentes = () => {

  const faqList = [
    {
      pregunta: '¿Cómo ponerse las medias?',
      respuesta:
        'Para ponerte las medias de compresión, simplemente inserta la mano dentro de la media, coloca la punta del pie en la abertura y desenrolla la media hacia arriba. Ajusta la media para que quede cómoda pero firme en la pierna. Si necesitas ayuda, busca a alguien o utiliza un dispositivo de ayuda.'
    },
    {
      pregunta: '¿Las medias de compresión son solo para atletas profesionales?',
      respuesta:
        'No, las medias de compresión no son solo para atletas profesionales. Cualquier persona puede beneficiarse de su uso, especialmente aquellas que pasan mucho tiempo de pie, tienen problemas de circulación, o quieren mejorar el rendimiento durante el ejercicio físico.'
    }
  ];

  return (
    <>  
      <div className={ styles.main } >
        <h1>Preguntas Frecuentes</h1>
        <div className={ styles.container }>
          {faqList.map((item, index) => (
            <Pregunta key={index} pregunta={item.pregunta} respuesta={item.respuesta} />
          ))}
        </div>
      </div>
    </>
  )
}
