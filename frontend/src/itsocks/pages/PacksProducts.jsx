//REACT
import React, { useEffect, useRef } from "react";

// ACTIONS
import { getProductsListByType } from "../../actions/getProductsList";

//UTILITIES
import { types } from "../../types/types";

//REACT-REDUX
import { useDispatch, useSelector } from "react-redux";

import styles from "../../ui/styles/Accesorios.module.css";
import { PackProductoList } from "../components/packs/PackProductList";
import { PackProductFilter } from "../components/packs/PackProductFilter";
import { PackProductFilter2 } from "../components/packs/PackProductFilter2";

export const PacksProducts = ({ categoria, type, disenio = null }) => {
  // console.log(type);

  const mounted = useRef(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (mounted) {
      dispatch(getProductsListByType(categoria, type));
    }

    return () => {
      mounted.current = false;
      dispatch({
        type: types.unmountProducts,
      });
    };
  }, []);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.trancking_container}>
            <h1>{categoria?.toUpperCase()} </h1>
          </div>
          <PackProductoList disenio={disenio} />
          {disenio ? (
            <PackProductFilter2
              categoria={categoria}
              type={type}
              disenio={disenio}
            />
          ) : (
            <PackProductFilter categoria={categoria} type={type} />
          )}
        </div>
      </div>
    </>
  );
};
