import React, { useEffect, useReducer, useRef, useState } from "react";

// React Reouter DOM
import { Link, useLocation, useNavigate } from "react-router-dom";

// Images
import back_circle_arrow from '../../../../public/assets/producto/back_circle_arrow.svg'
import xCircle from "../../../assets/navbar/x_circle.svg";

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
  showFilters,
  setShowFilters
}) => {

  const { pack, substrackProductFromPack } = usePack();

  // const pack = JSON.parse(localStorage.getItem("pack"))

  const initialStatePack = pack.prductos ? pack.prductos.map((producto) => producto.name) : null;

  const [checkedItems, setCheckedItems] = useState({});
  const [ disenio, setDisenio ] = useState(null)
  const location = useLocation().pathname;
  const [productosPack, setProductosPack] = useState(initialStatePack);
  const [isChecked, setIsChecked] = useState({});
  const [ compresion, setCompresion ] = useState();
  const navigate = useNavigate();

  const handleCheckBoxChange = (event, product) => {
    const updatedCheckedItems = { ...isChecked, [product.name]: event.target.checked };
    setIsChecked(updatedCheckedItems);
    if (!event.target.checked) {
      substrackProductFromPack(product)
    }
  };


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
    setProductosPack([...pack.prductos.map((producto) => producto.name)]);
  }, [pack]);

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

  const capitalizeText = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  return (
    <>
      
      {
        location.split("/").length == 3 ?
        <div className={showFilters ? `${styles.product_filter_pack} ${styles.visible}`: styles.product_filter_pack}>
          <div className={styles.x_circle} onClick={ () => setShowFilters(!showFilters)}>
            <img src={xCircle} alt="Cerrar Menu" />
          </div>
          <button className={styles.selected_button_pack} value={pack.name}>
            {pack.name}
          </button>
          <div className={styles.filters_container}>
            <h3>Filtra por diseño</h3>
            {Object.getOwnPropertyNames(checkedItems).map((disenio) => (
              <Link to={disenio} key={disenio}>
                <button className={styles.filter_buttons} value={disenio}>
                  {capitalizeText(disenio)}
                </button>
              </Link>
            ))}
          </div>
          

          {initialStatePack && productosPack.length !== 0 && typeof productosPack === "object" ? (
            <div className={styles.pack_products}>
              <h5>Medias seleccionadas</h5>
              <div className={styles.pack_products_checks}>
                {productosPack?.map((producto, index) => (
                  <label key={index}>
                    <input
                      type="checkbox"
                      value={producto}
                      checked={isChecked[producto] || true}
                      onChange={ () => handleCheckBoxChange(event, pack.prductos.filter( product => product.name === producto )[0])}
                      // defaultChecked={producto !== "" ? true : false}
                      
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
      <div className={showFilters ? `${styles.product_filter_pack} ${styles.visible}`: styles.product_filter_pack}>
          <div className={styles.x_circle} onClick={ () => setShowFilters(!showFilters)}>
            <img src={xCircle} alt="Cerrar Menu" />
          </div>
          <div className={ styles.back_circle_arrow}>
            <img src={ back_circle_arrow } alt="Flecha de regreso" onClick={ retroceder }/>
            <p>Volver a filtro por diseño</p>
          </div>
          <button className={styles.selected_button_pack} value={pack.name}>
            {pack.name}
          </button>
          {Object.getOwnPropertyNames(checkedItems).filter( 
            item => item.toLowerCase() == disenio
          ).map((disenio) => (
          
              
              <div className={`${ styles.filter_selected}`} key={ disenio }>
                  <button 
                    className={`${styles.selected_button_pack}`} 
                    value={disenio}              
                  >
                    {capitalizeText(disenio)}
                    
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
