import React, { useEffect, useReducer, useRef, useState } from "react";

// React Reouter DOM
import { Link, useLocation, useNavigate } from "react-router-dom";

// Images
import back_circle_arrow from '../../../../public/assets/producto/back_circle_arrow.svg'

//UTILITIES
import { filters } from "../../data/filters";

import styles from "../../../ui/styles/Accesorios.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductsListByFilterSubcategory,
  getProductsListByTypeAndDesign,
} from "../../../actions/getProductsList";
import { usePack } from "../../../hooks/usePack";
import { getCompresionFilters, getPackCompresionFilters, getPackProductsFilters } from "../../helpers/getProductsByCategory";

export const PackProductFilter = ({
  categoria,
  type = null,
  skip_page,
}) => {

  const { pack } = usePack();

  const initialStatePack = pack.prductos ? pack.prductos.map((producto) => producto.name) : null;


  const [checkedItems, setCheckedItems] = useState({});
  const [ disenio, setDisenio ] = useState(null)
  const location = useLocation().pathname;
  const [productosPack, setProductosPack] = useState(initialStatePack);
  const [ compresion, setCompresion ] = useState();
  const navigate = useNavigate();


  useEffect(() => {
    
    getPackProductsFilters( categoria, type).then(
      (res) => setCheckedItems(res)
    ).catch(
      (err) => console.log(err)
    )
    
  }, [categoria, type])

  let subcategory = null;

  for (let clave in checkedItems) {
    if (checkedItems[clave] === true) {
      subcategory = clave;
      break;
    }
  }

  const retroceder = () => {
    navigate(-1);
  };

  useEffect(() => {
    for (let index = 0; index < pack.cantidad - productosPack.length; index++) {
      setProductosPack([...productosPack, ""]);
      console.log(index);
    }
  });

  useEffect(() => {
    let newDisenio = null;
  
    if (location.split("/")[3]) {
      newDisenio = location.split("/")[3].replaceAll('%20', ' ').toLowerCase();
    }
  
    if (newDisenio !== null) {
      setDisenio(newDisenio);
    }

    if (location.split('/').length === 4) {
      getPackCompresionFilters(
        location.split('/')[2].toLocaleLowerCase().replaceAll('_', ' ').replaceAll('cania', 'caña'),
        location.split('/')[3].toLocaleLowerCase().replaceAll('%20', ' ')
      ).then(
        (res) => setCompresion(res)
      ).catch(
        (err) => console.log(err)
      )
    }

  }, [location]);

  console.log(compresion)

  return (
    <>
      {
        location.split("/").length == 3 ?
        <div className={styles.product_filter_pack}>
          <button className={styles.selected_button} value={pack.name}>
            {pack.name.toUpperCase()}
          </button>

          {Object.getOwnPropertyNames(checkedItems).map((disenio) => (
            <Link to={disenio} key={disenio}>
              <button className={styles.filter_buttons} value={disenio}>
                {disenio}
              </button>
            </Link>
          ))}

          {initialStatePack && productosPack.length !== 0 && typeof productosPack === "object" ? (
            <div className={styles.pack_products}>
              <h5>Medias seleccionadas</h5>
              <div className={styles.pack_products_checks}>
                {productosPack?.map((producto, index) => (
                  <label key={index}>
                    <input
                      type="checkbox"
                      value={producto}
                      defaultChecked={producto !== "" ? true : false}
                    />
                    {producto !== "" ? producto : "Pendiente"}
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <></>
          )}
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
            location.split("/").length == 4 ?
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
                {location.split("/")[4].replaceAll('_', ' ').replaceAll('compresion', 'compresión').replaceAll('medias', 'Medias')}
                
              </button> 
              </div>
            </div>
          }
        </div>
      }


      
    </>
  );
};
