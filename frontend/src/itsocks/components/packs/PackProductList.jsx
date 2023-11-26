//REACT
import React from "react";

// ACTIONS
import { PackProductoCard } from "./PackProductoCard";

// STYLES
import styles from "../../../ui/styles/Accesorios.module.css";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export const PackProductoList = ({ disenio }) => {
  // EXTRAER EL ÚLTIMO SEGMENTO DE LA RUTA ACTUAL
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];

  let products = useSelector((state) => state.product.products);

  if (["animales", "naturaleza", "comida"].includes(lastSegment) && products) {
    products = products.filter((producto) => producto.design === disenio);
  }

  return (
    <div className={styles.products_container}>
      {Object.keys(products).map((producto) => (
        <PackProductoCard key={producto} {...products[producto]} />
      ))}
    </div>
  );
};
