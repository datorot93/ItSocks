import React from 'react'

import styles from '../../ui/styles/ScrollHorizontal.module.css';

export const ScrollHorizontal = ({images}) => {
  return (
    <section className={ styles.main }>
        <div className={ styles.container }>
            <div className={ styles.image_scroll}>
                {
                    images.map( image => (
                        <img src={ image.src } alt={ image.descruption } key={ image.id }/>
                    ))
                }
            </div>
        </div>
    </section>
  )
}
