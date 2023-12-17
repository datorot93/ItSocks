//REACT
import React from "react";

// ACTIONS
import { ProductoCard2 } from "./ProductoCard2";

// STYLES
import styles from "../../ui/styles/Accesorios.module.css";

export const ProductoList2 = ({ products }) => {
  console.log( products );

  return (
    <div className={styles.products_container}>
      {products.map((producto) => (
        <ProductoCard2 key={producto.id} {...producto} />
      ))}
    </div>
  );
};
