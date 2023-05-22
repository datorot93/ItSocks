import React from 'react';
import { MediasCategory } from '../components/MediasCategory';

// STYLES
import styles from '../../ui/styles/Medias.module.css';

export const Medias = ({ subcategory }) => {
  return (
    <div  className={ styles.main }>
      <h1>{ subcategory?.toUpperCase() }</h1>
      <div className={ styles.container }>
        <MediasCategory />
      </div>
    </div>
  )
}
