import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import styles from "./../styles/MigaDePan.module.css";
import { useSelector } from "react-redux";
import { usePack } from "../../hooks/usePack";

export const MigaDePan = () => {
  const location = useLocation();

  const capitalizeText = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  const pathnames = location.pathname
    .replaceAll("_", " ")
    .replaceAll("%20", " ")
    .replaceAll("%201", "")
    .replaceAll("%C3%B1", "ñ")
    .replaceAll("%C3%B3", "ó")
    .replaceAll("/mas", "/Más")
    .replaceAll("proteccion", "protección")
    .replaceAll("envios", "Envíos,")
    .replaceAll("garantias", "Garantías")
    .replaceAll("cambios", " y Cambios")
    .split("/")
    .filter((x) => x.charAt(0));

  return (
    <>
      {
        pathnames.length > 0 ?
        <div className={styles.miga_container}>
          <div className={styles.miga}>
            <Link to="/">{"Inicio"}</Link>
            {
              pathnames.map((path, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`.toLowerCase().replaceAll(' ', '_').replaceAll('á', 'a');
                let capitalizedPath = path.toLowerCase().charAt(0).toUpperCase() + path.slice(1);
                let clean_path = " | " + capitalizeText(capitalizedPath)
                  .replaceAll('_', '')
                  .replaceAll('%20', ' ')
                  .replaceAll('cania', 'caña')
                  .replaceAll("Guia tallas", "Guía de tallas")
                  .replaceAll("Pantorrillera", "Pantorrillera")
                  .replaceAll("Tipo media", "")
                  .replaceAll("Estilo media", "") + " ";
                  
                return (
                  <React.Fragment key={index}>
                    {
                      clean_path !== " |  " ?

                      <Link key={index} to={routeTo}>
                        {
                          clean_path
                        }
                      </Link>
                      :<></>
                    }
                  </React.Fragment>
                );
              })
            }
          </div>
        </div>
        :<></>
      }
    </>
  );
};
