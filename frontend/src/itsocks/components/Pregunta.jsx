import React, { useState } from 'react';

// Imégenes
import down_circle_arrow from '../../../public/assets/aqr/down_circle_arrow.svg';
import up_circle_arrow from '../../../public/assets/aqr/up_circle_arrow.svg';

// Estilos
import styles from '../../ui/styles/Pregunta.module.css';

export const Pregunta = ({ pregunta, respuesta}) => {
    const [showAnswer, setShowAnswer] = useState(false);

    const toggleAnswer = () => {
      setShowAnswer(!showAnswer);
    };

    if( showAnswer){
      
    }        
    return (
      <div>
        <div className={ `${styles.question} ${showAnswer ? styles.active : ''}`  } onClick={toggleAnswer}>
          <h3>{ pregunta }</h3>
          {
            showAnswer ?
            <img src={ up_circle_arrow} alt='Up Circle Arrow' />
            : <img src={ down_circle_arrow } alt='Up Circle Arrow' />
          }
          {/* <span>{respuesta ? '' : '+'}</span> */}
        </div>
        {showAnswer && <div className={ `${styles.answer} ${showAnswer ? styles.show : ''}` }>{respuesta}</div>}
      </div>
    );
}
