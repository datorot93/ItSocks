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
import { getPackProductsFilters } from "../../helpers/getProductsByCategory";

export const PackProductFilter = ({
  categoria,
  type = null,
  skip_page,
}) => {

  const { pack } = usePack();

  const initialStatePack = pack.prductos ? pack.prductos.map((producto) => producto.name) : null;


  const [checkedItems, setCheckedItems] = useState({});
  const [ disenio, setDisenio ] = useState(null)


  useEffect(() => {
    
    getPackProductsFilters( categoria, type).then(
      (res) => setCheckedItems(res)
    ).catch(
      (err) => console.log(err)
    )
    
  }, [categoria, type])

  const dispatch = useDispatch();

  let subcategory = null;

  for (let clave in checkedItems) {
    if (checkedItems[clave] === true) {
      subcategory = clave;
      break;
    }
  }

  const [productosPack, setProductosPack] = useState(initialStatePack);

  const location = useLocation().pathname;

  const handleChecked = async (e, subcategory) => {
    setCheckedItems((prevState) => {
      const updatedItems = {};
      Object.keys(prevState).forEach((key) => {
        updatedItems[key] = key === subcategory ? !prevState[key] : false;
      });
      return updatedItems;
    });
  };
  // FILTRAR POR DISENIO
  const navigate = useNavigate();

  const handleDisenio = (event, disenio) => {
    navigate(disenio);
  };

  const retroceder = () => {
    navigate(-1);
  };

  // // CARGA INICIAL
  // useEffect(() => {
  //   if (!subcategoria && !type) {
  //     dispatch(getProductsListByFilterSubcategory(categoria, checkedItems));
  //   } else if (!subcategoria && type) {
  //     dispatch(getProductsListByTypeAndDesign(checkedItems, categoria, type));
  //   } else {
  //     dispatch(
  //       getProductsListByFilterSubcategory(
  //         categoria,
  //         checkedItems,
  //         subcategoria,
  //         type,
  //         skip_page
  //       )
  //     );
  //   }
  // }, [checkedItems]);

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
  }, [location]);


  return (
    <>
      {
        location.split("/").length != 4 ?
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
        </div>
      }
      
    </>
  );
};
