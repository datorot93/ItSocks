import React from 'react';
import { MediasTipos } from '../components/MediasTipos';

// STYLES
import styles from '../../ui/styles/Medias.module.css';

export const Personalizadas = ({ subcategory }) => {
  
  return (
    <div  className={ styles.main }>
      <h1>{ ` MEDIAS ${subcategory?.toUpperCase()}` }</h1>
      <div className={ styles.container }>
        <MediasTipos subcategory={ subcategory }/>
      </div>
    </div>
  )
}
