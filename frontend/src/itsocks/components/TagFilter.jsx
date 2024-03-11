import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { getTagSubcategoryCompresionFilters, getTagSubcategoryFilters, getTagTypeCompresionFilters, getTagTypeFilters } from '../helpers/getProductsByCategory';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Images
import back_circle_arrow from '../../../public/assets/producto/back_circle_arrow.svg'


// Estilos
import styles from "../../ui/styles/Accesorios.module.css";

export const TagFilter = ( {estilo} ) => {
  
  const [subcategories, setSubcategories] = useState(null);
  const [types, setTypes] = useState(null);
  const [compresion, setCompresion] = useState(null)

  const location = useLocation().pathname;
  const navigate = useNavigate();
  const exceptions_array = ['Viseras', 'termos', 'canguros', 'pines']
  
  
  useEffect(() => {

    getTagSubcategoryFilters(estilo).then(
      (res) => setSubcategories(res)
    ).catch(
      (err) => console.log(err)
    )

    getTagTypeFilters(estilo).then(
      (res) => setTypes(res)
    ).catch(
      (err) => console.log(err)
    )
    

    if(location.split('/').length > 2){
      let current_filter = location.split('/')[3].replace('media_cania', 'Media caña')
      if(location.split('/')[2] === 'tipo_media' && !exceptions_array.includes(current_filter)){
        getTagSubcategoryCompresionFilters(estilo, current_filter).then(
          (res) => setCompresion(res)
        ).catch(
          (err) => console.log(err)
        )
      }else {
        getTagTypeCompresionFilters(estilo, current_filter).then(
          (res) => setCompresion(res)
        ).catch(
          (err) => console.log(err)
        )

      }
    }

  }, [location]);

  const retroceder = () => {
    navigate(-1);
  };

  return (
    <>
      {
        location.split('/').length === 2 ?
        <section>
          <div className={styles.product_filter}>
            <h3>Filtra por media</h3>

            {
              subcategories ?
              Object.getOwnPropertyNames(subcategories).map( (subcategorie) => (
                <Link
                  to={`tipo_media/${subcategorie.replace('Media caña', 'media_cania').toLowerCase()}`}
                  key={subcategorie}            
                >
                  <button 
                    className={`${styles.filter_buttons}`} 
                    value={subcategorie}   
                  >
                    {subcategorie}
                    
                  </button>  
                </Link>
              ))
              : <></>
            }
          </div>

          <div className={styles.product_filter}>

            <h5>Estilo de media</h5>
            {
              types ?
              Object.getOwnPropertyNames(types).map( (type, index) => (
                <Link
                  to={`estilo_media/${type.replace('Media caña', 'media_cania').toLowerCase()}`}
                  key={index}            
                >
                  <button 
                    className={`${styles.filter_buttons}`} 
                    value={type}   
                  >
                    {type}
                    
                  </button>  
                </Link>
              ))
              : <></>
            }
          </div>

        </section>
        :
        <section>
          
          <div className={styles.product_filter}>

            <div className={ styles.back_circle_arrow}>
              <img src={ back_circle_arrow } alt="Flecha de regreso" onClick={ () => navigate(-1) }/>
              <p>Volver a filtro por diseño</p>
            </div> 
            <div className={`${ styles.filter_selected}`}>

              <button 
                className={`${styles.selected_button}`}
              >
                {location.split('/')[3].replace('media_cania', 'Media caña')}
                
              </button>  
              
              <div 
                className={ styles.x_return_filter }
                onClick={ retroceder }
              >
                <span>X</span>
              </div>
            </div>

            <div className={ styles.compresion_filters} >
               <h4>Filtra por compresión</h4>
            
            {
              compresion && compresion['compresion_filters'].length == 1 ?

                <>
                  {
                    compresion.compresion_filters.map( filter => (

                      <div className={`${ styles.filter_selected}`}>
                        <button 
                          className={`${styles.selected_button}`}
                        >
                          {filter}
                        </button>  
                      </div>
                    ))
                  }
                </>

            :
              <>
                { 
                  compresion && location.split('/').length == 4?
                  
                      <>
                        {
                          compresion.compresion_filters.map( (filter, index) => (

                            <div className={`${ styles.filter_selected}`} key={ index }>
                              <Link
                                to={filter.replaceAll(' ', '_').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}
                                key={filter}
                              >
                                <button 
                                  className={`${styles.filter_buttons}`}
                                >
                                  {filter}
                                </button>  
                              </Link>
                            </div>
                          ))
                        }
                      </>
                    
                  :
                  <>
                  {

                      <>
                        {
                          location.split("/")[4] ?
                          <div className={`${ styles.filter_selected}`}>
                            <button 
                              className={`${styles.selected_button}`}
                            >
                              {location.split("/")[4].replaceAll('_', ' ').replaceAll('compresion', 'compresión').replaceAll('medias', 'Medias')}
                            </button>  
                          </div>
                          :<></>
                        }
                      </>

                  }
                </>
                }
              </>

            }
            </div>
          </div>
        </section>
        
      }
    </>
  )
}
