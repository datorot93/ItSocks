// React
import React, { useState } from 'react'

// Estilos
import styles from '../../../ui/styles/ProductDescription.module.css'

// Utilidades
import icono_regalo from '../../../../public/assets/packs/icono_regalo.png'

// import { getProductsByName } from '../helpers/getProductByName'
import { getProductsByPartOfName } from '../../helpers/getProductsByPartOfName'
import { LazyLoadImage } from 'react-lazy-load-image-component'

// Imágenes
import carrito from '../../../../public/assets/producto/carrito.svg'
import corazon from '../../../../public/assets/producto/corazon.svg'
import camion from '../../../../public/assets/producto/camion.svg'
import reloj from '../../../../public/assets/producto/reloj.svg'
import { PopUpCarrito } from '.././PopUpCarrito'
import { useCart } from '../../../hooks/useCart'



export const PackProductDescription = () => {

    
    const { addToCart, removeFromCart, cart } = useCart();

    // console.log(cart);
    const [selectedIndex, setSelectedIdenx] = useState(0);

    const product = localStorage.getItem('current_product');
    const producto = JSON.parse(product);

    const productos_packs = localStorage.getItem('packs')
    console.log

    const similares = getProductsByPartOfName( producto.name )
    
    const initialState = Object.keys(producto.images).slice(1, Object.keys(producto.images).length)
    


    // States
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

    const [ showPopUp, setShowPopUp ] = useState(false);
    const [ title, setTitle ] = useState('');

    const handleShowPopUp = ( title ) => {
        
        if (cantProducts > 0){
            if ( title === 'carrito') {
                    
                    setTitle('Carrito de compras')
                    console.log(cantProducts)
                    const product_to_add = { ...producto, cantidad: cantProducts}
                    addToCart(product_to_add)
                    // setCarritoCompras( [ ...carritoCompras, product_to_add ] )
                    // console.log(carritoCompras);
                    // localStorage.setItem('carrito_compras', JSON.stringify(carritoCompras))
                
            }else {
                setTitle('Lista de regalos')
            };
            setShowPopUp(true)
        }

    };
    
  return (
    <div className={ styles.main }>
        {
            showPopUp 
            ? <div className={ styles.block_page }></div>
            : <></>
        }
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
                    <p>{ `${producto.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}` }</p>
                </div>
                <div className={ styles.description_p }>
                    <p>{ producto.description }</p>
                </div>

                {/* <div className={ styles.guia_tallas }>                    
                    <span>¡¡Consulta tu guia de talla!!</span>         
                </div> */}

                <div className={ styles.cantidad_packs }>                    
                    <img src={ icono_regalo } alt='' />
                    <span>Productos seleccionados {'0'}/{'3'} </span>         
                </div>

                <div className={ styles.regresar_catalogo }>                    
                    REGRESAR AL CATALOGO
                </div>

                <div className={ styles.comprar }>
                    <div className={ styles.conteo }>
                        <button onClick={ () => setCantProducts( cantProducts + 1)}>+</button>
                        <span>{ cantProducts }</span>
                        <button onClick={ () => setCantProducts( cantProducts > 0 ? cantProducts - 1 : cantProducts)}>-</button>
                    </div>
                    <button className={ styles.boton_comprar}>AÑADIR A MI SELECCIÓN</button>
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
        {
            showPopUp && (
                <PopUpCarrito title={ title } product = { producto } showPopUp = { showPopUp } setShowPopUp={ setShowPopUp }/>
            )
        }
        
    </div>
  )
}
