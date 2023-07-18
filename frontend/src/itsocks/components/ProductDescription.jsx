// React
import React, { useState } from 'react'

// Estilos
import styles from '../../ui/styles/ProductDescription.module.css';

// Utilidades
// import { getProductsByName } from '../helpers/getProductByName';
import { getProductsByPartOfName } from '../helpers/getProductsByPartOfName';
import { LazyLoadImage } from 'react-lazy-load-image-component';

// Imágenes
import carrito from '../../../public/assets/producto/carrito.svg';
import corazon from '../../../public/assets/producto/corazon.svg';
import camion from '../../../public/assets/producto/camion.svg';
import reloj from '../../../public/assets/producto/reloj.svg';
import { PopUpCarrito } from './PopUpCarrito';

// React Reducx




export const ProductDescription = () => {

    const [selectedIndex, setSelectedIdenx] = useState(0);

    const product = localStorage.getItem('current_product');
    const producto = JSON.parse(product);

    const similares = getProductsByPartOfName( producto.name );
    
    const initialState = Object.keys(producto.images).slice(1, Object.keys(producto.images).length);
    
    const [ otherPhotos, setOtherPhotos ] = useState(initialState);
    const [ cantProducts, setCantProducts ] = useState(0);

    const next = () => {
        const condition = selectedIndex < (Object.keys(producto.images).length -1)
        const nextIndex = condition ? selectedIndex + 1 : 0;
        setSelectedIdenx(nextIndex);
        setOtherPhotos( Object.keys(producto.images).filter( image => image != Object.keys(producto.images)[nextIndex]));
    }

    const previus = () => {
        const condition = selectedIndex > 0
        const nextIndex = condition ? selectedIndex - 1 : (Object.keys(producto.images).length -1);
        setSelectedIdenx(nextIndex);
        setOtherPhotos( Object.keys(producto.images).filter( image => image != Object.keys(producto.images)[nextIndex]));
    }

    
    

  return (
    <div className={ styles.main }>
        <div className={ styles.description_container }>

            <div className={ styles.image_container }>
                <div className={ styles.principal_image }>
                    <button  className={ `${styles.arrow_button} ${ styles.left}`} onClick={ previus }>{'<'}</button>
                    <LazyLoadImage src={ producto.images[Object.keys(producto.images)[selectedIndex]] } alt={ producto.name } />
                    <button  className={ `${styles.arrow_button} ${ styles.right }`} onClick={ next }>{'>'}</button>
                </div>
                <div className={ styles.similares }>
                    {otherPhotos.map( (image, index) => (
                        <LazyLoadImage src={ producto.images[image] } alt={ producto.name } key={ index } />
                    ))}
                </div>
            </div>

            <div className={ styles.description }>
                <h2>{ producto.name }</h2>
                <div className={ styles.precio }>
                    <p>{ `$ ${producto.price}` }</p>
                </div>
                <div className={ styles.description_p }>
                    <p>{ producto.description }</p>
                </div>

                <div className={ styles.acciones }>
                    <div className={ styles.carrito } onClick={ () => alert('Acá debo mostrar el pop up de la izquierda') }>
                        
                            <img src={ carrito } alt= "Carrito de compras" />
                            <span>Agregar a carrito</span>
                        
                    </div>
                    <div className={ styles.corazon }>
                        <img src={ corazon } alt= "Corazon" />
                        <span>Añadir a mi lista</span>
                    </div>
                </div>

                <div className={ styles.comprar }>
                    <div className={ styles.conteo }>
                        <button onClick={ () => setCantProducts( cantProducts + 1)}>+</button>
                        <span>{ cantProducts }</span>
                        <button onClick={ () => setCantProducts( cantProducts - 1)}>-</button>
                    </div>
                    <button className={ styles.boton_comprar}>¡¡COMPRAR AHORA!!</button>

                </div>

                <div className={ styles.informacion_adicional }>
                    <img src={ camion } alt="Envíos" />
                    <p>Lleva <span>$200.000</span> más y el envío te sale gratis</p>                
                </div>

                <div className={ styles.tiempo_estimado }>
                    <img src={ reloj } alt="Reloj" />
                    <p>Tiempo estimado de envio entre lunes 24 abril and martes 25 abril.</p>                
                </div>
            </div>

        </div>

        <div className={ styles.productos_recomendados }>
            <h2>Productos recomendados 🔥</h2>
            <div className={styles.recommended_images}>
                
                { similares.map( producto => (
                    <LazyLoadImage 
                        key={ producto.id} 
                        src={ producto.images } 
                        alt={ producto.nombre }

                    />
                ))}
            </div>
        </div>
        <PopUpCarrito title={ 'Carrito de compra' } product = { producto }/>
    </div>
  )
}
