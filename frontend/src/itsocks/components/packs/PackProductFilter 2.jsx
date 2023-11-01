import React, { useEffect, useReducer, useRef, useState } from "react";

// React Reouter DOM
import { Link, useNavigate } from "react-router-dom";

//UTILITIES
import { filters } from "../../data/filters";

import styles from "../../../ui/styles/Accesorios.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductsListByFilterSubcategory,
  getProductsListByTypeAndDesign,
} from "../../../actions/getProductsList";
import { usePack } from "../../../hooks/usePack";

export const PackProductFilter = ({
  subcategoria = null,
  categoria,
  type = null,
}) => {
  const initialState2 = filters[categoria];

  // const productos_pack = JSON.parse(localStorage.getItem("pack")).prductos;

  const { pack } = usePack();

  // const [listaProdsPack, setListaProdsPack] = useState();

  const [checkedItems, setCheckedItems] = useState(initialState2);

  const dispatch = useDispatch();

  let subcategory = null;

  for (let clave in checkedItems) {
    if (checkedItems[clave] === true) {
      subcategory = clave;
      break;
    }
  }

  const mounted = useRef(false);

  const [productosPack, setProductosPack] = useState(Array(pack.cantidad));
  useEffect(() => {
    for (let index = 0; index < pack.cantidad; index++) {
      setProductosPack(productosPack.pop());
      setProductosPack(productosPack.splice(0, 0, pack.prductos[index]));
      // console.log(productosPack);
    }
    mounted.current = true;
  }, []);

  const handleProductosPack = () => {
    pack.prductos.map(() => productosPack.pop());
    pack.prductos.map((producto) => productosPack.splice(0, 0, producto));
  };
  // console.log(productos_pack);

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

  useEffect(() => {
    if (!subcategoria && !type) {
      dispatch(getProductsListByFilterSubcategory(categoria, checkedItems));
    } else if (!subcategoria && type) {
      dispatch(getProductsListByTypeAndDesign(checkedItems, categoria, type));
    } else {
      dispatch(
        getProductsListByFilterSubcategory(
          categoria,
          checkedItems,
          subcategoria,
          type
        )
      );
    }
  }, [checkedItems]);

  return (
    <>
      <div className={styles.product_filter_pack}>
        <button className={styles.selected_button} value={pack.nombre}>
          {pack.nombre}
        </button>

        {Object.getOwnPropertyNames(checkedItems).map((disenio) => (
          <Link to={disenio} key={disenio}>
            <button className={styles.filter_buttons} value={disenio}>
              {disenio}
            </button>
          </Link>
        ))}

        {pack.prductos.length !== 0 ? (
          <div className={styles.pack_products}>
            <h5>Medias seleccionadas</h5>
            <div className={styles.pack_products_checks}>
              {pack.prductos.map((producto, index) => (
                <label key={index}>
                  <input
                    type="checkbox"
                    value={producto.name}
                    defaultChecked={true}
                  />
                  {producto.name}
                </label>
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
