import React, { useEffect, useState } from 'react'

// IMAGES
// import popup_promo_c from '../../../assets/homepage/popup_promo_c.jpg.webp'
import popup_promo_c from '../../../public/assets/homepage/popup_promo_c.jpg.webp'

// STYLES
import styles from '../../ui/styles/PopUpPromo.module.css'
import { postUniqueDiscountCode } from '../helpers/getDiscountsCodes'


export const PopUpPromo = ({ setShowPopup }) => {

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [showErrorMessage, setShowErrorMessage] = useState(false)

  const handleInputName = (e) => {
    setName(e.target.value)
  }

  const handleInputEmail = (e) => {
    setEmail(e.target.value)
  }


  const handleGenCode = async() => {
    const data = await postUniqueDiscountCode(email, name)

    if (!data.detail){

      setEmail('')
      setName('')
      setShowPopup(false)
      console.log(data)
    }else {
      setShowErrorMessage(true)
    }
  }


  const handleClosePopUp = () => {
    setShowPopup(false)
  }

  return (
    <div className={styles.pop_up_promo}>

      <div className={styles.pop_up_promo_container}>
        <div 
          className={ styles.close_popup}
          onClick={ handleClosePopUp }
        >
          X
        </div>

        <div className={ styles.imagen_promo }>
          <img src={popup_promo_c} alt="promo" />
        </div>

        <div className={ styles.info_promo }>
          <div className={styles.info_promo_input}>
            <label>Nombre</label>
            <input type="text" value={name} onChange={ handleInputName}/>
          </div>

          <div className={styles.info_promo_input}>
            <label>Correo elctrónico</label>
            <input type="text" value={email} onChange={ handleInputEmail }/>
          </div>
          {
            showErrorMessage && <p className={ styles.mensaje_error }>Este correo electrónico ya tiene un descuento generado</p>
          }
          {/* <p className={ styles.mensaje_error }>Este correo electrónico ya tiene un descuento generado</p> */}
          <button 
            className={ styles.button_discount }
            onClick={ handleGenCode }
          >Obtener descuento</button>
        </div>
        
      </div>
    </div>
  )
}
