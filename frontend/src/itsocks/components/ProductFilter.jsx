import React, { useEffect, useMemo, useState } from "react";

// React Reouter DOM
import { Link, useLocation, useNavigate } from "react-router-dom";

// Images
import back_circle_arrow from '../../../public/assets/producto/back_circle_arrow.svg'

//UTILITIES
import { filters } from "../data/filters";
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

export const ProductFilter = ({
  subcategoria = null,
  categoria,
  type = null,
}) => {

  const products = useSelector((state) => state.product.products);

  
  // let resultado = useMemo(
  //   () => products.flatMap( obj => obj.design ? [obj.design] : []),
  //   [products]
  // );

  // console.log(resultado); 

  const initialState2 = filters[categoria];


  const navigate = useNavigate();

  const [checkedItems, setCheckedItems] = useState(initialState2);
  const [selectedDesign, setSelectedDesign] = useState(null);

  const location = useLocation().pathname;

  // const lista_productos = useSelector((state) => state.product.products);

  const dispatch = useDispatch();

  let subcategory = null;

  for (let clave in checkedItems) {
    if (checkedItems[clave] === true) {
      subcategory = clave;
      break;
    }
  }

  const handleChecked = async (e, subcategory) => {
    setCheckedItems((prevState) => {
      const updatedItems = {};
      Object.keys(prevState).forEach((key) => {
        updatedItems[key] = key === subcategory ? !prevState[key] : false;
      });
      return updatedItems;
    });
  };

  const handleClick = (e) => {
    dispatch({
      type: types.loadProducts,
      payload: products.filter(
        product => product.design === e.target.value
      ),
    })
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

  return (
    <>
      {
        location.split("/").length != 5 ?
        <div className={styles.product_filter}>
        
          {Object.getOwnPropertyNames(checkedItems).map((disenio) => (

              <Link 
                to={disenio} 
                key={disenio}
                onClick={ handleClick }
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
          {Object.getOwnPropertyNames(checkedItems).filter( item => item.toLowerCase() == location.split("/")[4].replaceAll('%20', ' ').toLowerCase()).map((disenio) => (
          
              
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
        </div>
      }
    </>
  );
};
