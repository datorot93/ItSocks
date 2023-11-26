import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import styles from "./../styles/MigaDePan.module.css";

export const MigaDePan = () => {
  const location = useLocation();
  const pathnames = location.pathname
    .replace("_", " ")
    .replace("%20", " ")
    .replace("%201", "")
    .split("/")
    .filter((x) => x.charAt(0));

  return (
    <div className={styles.miga_container}>
      <div className={styles.miga}>
        <Link to="/">{"Inicio"}</Link>
        {pathnames.map((path, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;

          return (
            <Link key={index} to={routeTo}>
              {" > " + path + " "}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
