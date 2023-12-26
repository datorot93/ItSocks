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
import { getFiltersAccesorios, getProductsFilters } from "../helpers/getProductsByCategory";

export const ProductFilter = ({
  subcategoria = null,
  categoria,
  type = null,
}) => {

  const products = useSelector((state) => state.product.products);

  const [filters2, setFilters2] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [ disenio, setDisenio ] = useState(null)

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
  }, [location]);

  return (
    <>
      {
        (location.split("/").length != 5 && location.split("/")[1].toLowerCase() !== 'accesorios') || (location.split("/").length != 3 && location.split("/")[1].toLowerCase() === 'accesorios') ?
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
        </div>
      }
    </>
  );
};
