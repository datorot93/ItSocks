import React, { useEffect, useState } from "react";

// REACT-REDUX
import { useDispatch, useSelector } from "react-redux";

// React Reouter DOM
import { useNavigate } from "react-router-dom";

//UTILITIES
import { types } from "../../types/types";

import styles from "../../../ui/styles/Accesorios.module.css";

export const FilterPacks = ({ lista_packs }) => {
  const initialState = {};

  lista_packs.map((item) => {
    const key = item.name.toUpperCase();
    initialState[key] = false;
  });

  const [checkedItems, setCheckedItems] = useState(initialState);

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

  return (
    <>
      {lista_packs ? (
        <div className={styles.product_filter}>
          {Object.getOwnPropertyNames(checkedItems).map((subcategory) => (
            <label key={subcategory}>
              <input
                key={subcategory}
                type="checkbox"
                id={subcategory}
                checked={checkedItems[subcategory]}
                value={subcategory}
                onChange={(event) => handleChecked(event, subcategory)}
              />
              {subcategory}
            </label>
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
