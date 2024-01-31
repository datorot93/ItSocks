import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import styles from "./../styles/MigaDePan.module.css";
import { useSelector } from "react-redux";
import { usePack } from "../../hooks/usePack";

export const MigaDePan = () => {
  const location = useLocation();
  const pathnames = location.pathname
    .replaceAll("_", " ")
    .replaceAll("%20", " ")
    .replaceAll("%201", "")
    .replaceAll("%C3%B1", "ñ")
    .replaceAll("%C3%B3", "ó")
    .split("/")
    .filter((x) => x.charAt(0));

  return (
    <>
      {
        pathnames.length > 0 ?
        <div className={styles.miga_container}>
          <div className={styles.miga}>
            <Link to="/">{"Inicio"}</Link>
            {pathnames.map((path, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`.toLowerCase().replaceAll(' ', '_');
              let capitalizedPath = path.toLowerCase().charAt(0).toUpperCase() + path.slice(1);
              return (
                <Link key={index} to={routeTo}>
                  {" | " + capitalizedPath.replaceAll('_', '').replaceAll('%20', ' ') + " "}
                </Link>
              );
            })}
          </div>
        </div>
        :<></>
      }
    </>
  );
};
