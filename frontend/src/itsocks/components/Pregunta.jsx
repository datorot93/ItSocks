import React, { useState } from 'react';


import styles from '../../ui/styles/Pregunta.module.css';

export const Pregunta = ({ pregunta, respuesta}) => {
    const [showAnswer, setShowAnswer] = useState(false);

    const toggleAnswer = () => {
      setShowAnswer(!showAnswer);
    };
    
    return (
      <div>
        <div className={ `${styles.question} ${showAnswer ? styles.active : ''}`  } onClick={toggleAnswer}>
          <h3>{ pregunta }</h3>
          <span>{respuesta ? '' : '+'}</span>
        </div>
        {showAnswer && <div className={ `${styles.answer} ${showAnswer ? styles.show : ''}` }>{respuesta}</div>}
      </div>
    );
}
