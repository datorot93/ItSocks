import React, { useEffect, useMemo, useState } from "react";

// React Reouter DOM
import { Link, useLocation, useNavigate } from "react-router-dom";

// Images
import back_circle_arrow from '../../../public/assets/producto/back_circle_arrow.svg'

// Estilos
import styles from "../../ui/styles/Accesorios.module.css";

//REACT-REDUX
import { useDispatch, useSelector } from "react-redux";

// ACTIONS
import {
  getProductsListByFilterSubcategory,
  getProductsListByTypeAndDesign,
} from "../../actions/getProductsList";

import { types } from "../../types/types";
import { getCompresionFilters, getFiltersAccesorios, getProductsFilters } from "../helpers/getProductsByCategory";

export const ProductFilter = ({
  subcategoria = null,
  categoria,
  type = null,
}) => {

  const products = useSelector((state) => state.product.products);
  

  const [checkedItems, setCheckedItems] = useState({});
  const [ disenio, setDisenio ] = useState(null);
  const [ compresion, setCompresion ] = useState();

  useEffect(() => {
    if(subcategoria && type) {
      getProductsFilters( categoria, subcategoria, type).then(
        (res) => setCheckedItems(res)
      ).catch(
        (err) => console.log(err)
      )
    } else {
      getFiltersAccesorios( categoria, subcategoria, type).then(
        (res) => setCheckedItems(res)
      ).catch(
        (err) => console.log(err)
      )
    };
  }, [categoria, subcategoria, type])

  const navigate = useNavigate();

  const location = useLocation().pathname;

  const dispatch = useDispatch();

  let subcategory = null;

  for (let clave in checkedItems) {
    if (checkedItems[clave] === true) {
      subcategory = clave;
      break;
    }
  }

 
  useEffect(() => {
    if (!subcategoria && !type) {
      dispatch(getProductsListByFilterSubcategory(products, categoria, checkedItems));
    } else if (!subcategoria && type) {
      dispatch(getProductsListByTypeAndDesign(products, checkedItems, categoria, type));
    } else {
      dispatch(
        getProductsListByFilterSubcategory(
          products,
          categoria,
          checkedItems,
          subcategoria,
          type
        )
      );
    }
  }, [checkedItems]);

  const retroceder = () => {
    navigate(-1);
  };

  console.log(compresion)
  useEffect(() => {
    let newDisenio = null;
  
    if (location.split("/")[4]) {
      newDisenio = location.split("/")[4].replaceAll('%20', ' ').toLowerCase();
    } else if (location.split("/")[1].toLowerCase() === 'accesorios' && location.split("/")[2]) {
      newDisenio = location.split("/")[2].replaceAll('%20', ' ').toLowerCase();
    }
  
    if (newDisenio !== null) {
      setDisenio(newDisenio);
    }

    if (location.split('/').length === 5) {
      getCompresionFilters(
        location.split('/')[1].toLocaleLowerCase(),
        location.split('/')[2].toLocaleLowerCase(),
        location.split('/')[3].toLocaleLowerCase().replaceAll('_', ' ').replaceAll('larga', 'largas').replaceAll('pantorrillera', 'pantorrilleras').replaceAll('cania', 'caña'),
        location.split('/')[4].toLocaleLowerCase().replaceAll('%20', ' ')
      ).then(
        (res) => setCompresion(res)
      ).catch(
        (err) => console.log(err)
      )
    }
  }, [location]);

  return (
    <>
      {
        (location.split("/").length == 4 && location.split("/")[1].toLowerCase() !== 'accesorios') || (location.split("/").length != 3 && location.split("/")[1].toLowerCase() === 'accesorios') ?
        <div className={styles.product_filter}>
        
          {Object.getOwnPropertyNames(checkedItems).map((disenio) => (

              <Link 
                to={disenio} 
                key={disenio}
                // onClick={ handleClick }
              >
                <button 
                  className={styles.filter_buttons} 
                  value={disenio}              
                >
                  {disenio}
                </button>
              </Link>
            
          ))}
        </div>
        :

        <div className={styles.product_filter}>
          <div className={ styles.back_circle_arrow}>
            <img src={ back_circle_arrow } alt="Flecha de regreso" onClick={ retroceder }/>
            <p>Volver a filtro por diseño</p>
          </div>
          {Object.getOwnPropertyNames(checkedItems).filter( 
            item => item.toLowerCase() == disenio
          ).map((disenio) => (
          
              <div className={`${ styles.filter_selected}`} key={ disenio }>
                  <button 
                    className={`${styles.selected_button}`} 
                    value={disenio}              
                  >
                    {disenio}
                    
                  </button>  

                <div 
                    className={ styles.x_return_filter }
                    onClick={ retroceder }
                  >
                  <span>X</span>
                </div>
              </div>

          ))}

          {
            location.split("/").length == 5 && location.split("/")[1].toLowerCase() !== 'accesorios' ?
            <div className={ styles.filtros_compresion }>
              <h3>Filtra por compresión</h3>
              <div className={ styles.compresion_buttons }>

                {
                  compresion && compresion['compresion_filters'].length == 2 ?
                  compresion['compresion_filters'].map( filter => (   
                      <Link
                        to={filter.replaceAll(' ', '_').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}
                        key={filter}
                      >
                        <button 
                            className={`${styles.filter_buttons}`} 
                            value={filter}  
                            key={filter}            
                          >
                            {filter}
                        </button>
                      </Link>   
                  ))
                  :<></>
                }

                {
                  compresion && compresion['compresion_filters'].length == 1 ?
                  compresion['compresion_filters'].map( filter => (
                      <button 
                        className={`${styles.selected_button}`} 
                        value={filter}
                        key={filter}              
                      >
                        {filter}
                        
                      </button> 
                  ))
                  : <></>
                }
              </div>
            </div>
            : 
            <div className={ styles.filtros_compresion }>
              <h3>Filtra por compresión</h3>
              <div className={ styles.compresion_buttons }>
              <button 
                className={`${styles.selected_button}`}              
              >
                {location.split("/")[5].replaceAll('_', ' ').replaceAll('compresion', 'compresión').replaceAll('medias', 'Medias')}
                
              </button> 
              </div>
            </div>
          }

        </div>
      }
    </>
  );
};
