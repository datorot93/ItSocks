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

  const { pack } = usePack();

  const initialStatePack = pack.prductos.map((producto) => producto.name);

  console.log("ESTOS SON LOS PRODUCTOS DE PACK");
  console.log(pack.prductos);

  const [checkedItems, setCheckedItems] = useState(initialState2);

  const dispatch = useDispatch();

  let subcategory = null;

  for (let clave in checkedItems) {
    if (checkedItems[clave] === true) {
      subcategory = clave;
      break;
    }
  }

  const [productosPack, setProductosPack] = useState(initialStatePack);

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

  // CARGA INICIAL
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

  useEffect(() => {
    for (let index = 0; index < pack.cantidad - productosPack.length; index++) {
      setProductosPack([...productosPack, ""]);
      console.log(index);
    }
  });

  // for (let index = 0; index < pack.cantidad - productosPack.length; index++) {
  //   setProductosPack(productosPack.push(""));
  //   console.log(index);
  // }
  console.log("ESTE ES EL PRODUCTO PACK");
  console.log(productosPack);

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

        {productosPack.length !== 0 && typeof productosPack === "object" ? (
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
    </>
  );
};
