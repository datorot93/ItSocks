// React
import React from 'react';

// Componentes
import { Pregunta } from '../components/Pregunta';

// Images
import ponerse_medias from '../../../public/assets/aqr/ponerse_medias.png';

// Estilos
import styles from '../../ui/styles/PreguntasFrecuentes.module.css';

export const PreguntasFrecuentes = () => {

  const faqList = [
    {
      pregunta: '¿Cómo cuidar mis medias de compresión?',
      respuesta:
        <div className={ styles.cuidado}>
          <p className={ styles.inner_text}>Instrucciones de cuidado:</p>
          <ul>
            <li>No usar productos blanqueadores</li>
            <li>Lavar la prenda al revés</li>
            <li>No usar lavadora; Lavar a mano</li>
            <li>No dejar en remojo ni retorcer</li>
          </ul>
        </div>
    },
    {
      pregunta: '¿Cómo ponerse las medias?',
      respuesta: <img src={ ponerse_medias } alt="Ponerse las medias" />        
    },
    {
      pregunta: '¿Las medias de compresión son solo para atletas profesionales?',
      respuesta: <p><strong>Absolutamente no.</strong> Cualquier persona las puede usar, incluso los atletas aficionados que quiere cuidar su cuerpo y mejorar su rendimiento. Desde que somo jóvenes es bueno empezar a utilizar las medias de compresión para prevenir problemas circulatorios. <strong>¡Todos merecemos piernas felices y saludables!</strong></p>
    },
    {
      pregunta: '¿Con qué frecuencia se deben reemplazar las medias de compresión?',
      respuesta: <p>Si las usas de manera habitual, es recomendable reemplazarlas <strong>cada 4 o 5 meses</strong> para que su efectividad no disminuya con el paso del tiempo y los lavados que se le hagan.</p>
    },
    {
      pregunta: '¿Cuál es la diferencia entre las medias largas y las pantorrilleras de compresión, y cuándo debo usar cada una?',
      respuesta: 
        <div className={ styles.diferencias}>
          <p><strong><span>Pantorrilleras:</span> Úsalas mientras estes activo.</strong></p>
          <p>No recomendamos usarlas en predioso de inactividad, o durante la recuperación después de estar mucho tiempo corriendo; en estos periodos la sangre puede comenzar a acumularse en tus pies</p>
          <p><strong><span>Medias largas:</span> Úsalas en cualquier momento</strong></p>
          <p>Son excelentes para el rendimiento y la recuperación. Puedes usarlas antes, durante y después de una carrera, esto te ayudará continuamente con el flujo sanguineo y el retorno venoso</p>
        </div>
    },
    {
      pregunta: '¿Cómo puedo hacer seguimiento de mi pedido?',
      respuesta: <div className={ styles.seguimiento}>
          <p>Una vez despachemos tu pedido, recibirás un correo con el resumen del mismo y encontrarás la información de envío, número de guía y transportadora.</p>
          <p>Así mismo, puedes contactar a nuestra línea de atención al cliente (ling wtp) donde te podremos ayudar a consultar más detalles de tu compra si lo necesitas.</p>
        </div>
    }
  ];

  return (
    <>  
      <div className={ styles.main } >
        <h1>PREGUNTAS FRECUENTES</h1>
        <div className={ styles.container }>
          {faqList.map((item, index) => (
            <Pregunta key={index} pregunta={item.pregunta} respuesta={item.respuesta} />
          ))}
        </div>
      </div>
    </>
  )
}
