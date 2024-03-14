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
          <p>{ pregunta }</p>
          {
            showAnswer ?
            <img src={ up_circle_arrow} alt='Up Circle Arrow' className='animate__animated animate__rotateIn'/>
            : <img src={ down_circle_arrow } alt='Up Circle Arrow' className='animate__animate animate__bounceInUp'/>
          }
          {/* <span>{respuesta ? '' : '+'}</span> */}
        </div>
        {showAnswer && <div className={ `${styles.answer} ${showAnswer ? styles.show : 'animate__animated animate__fadeInDown'} animate__animated animate__fadeInDown` }>{respuesta}</div>}
      </div>
    );
}
