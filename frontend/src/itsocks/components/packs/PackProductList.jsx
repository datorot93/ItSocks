//REACT
import React, { useEffect, useState } from "react";

// ACTIONS
import { PackProductoCard } from "./PackProductoCard";

// UTILITIES
import InfiniteScroll from 'react-infinite-scroll-component';

// STYLES
import styles from "../../../ui/styles/Accesorios.module.css";
import { useLocation } from "react-router-dom";
import { useFetchPackItems } from "../../../hooks/useFetchPacksItems";
import { usePack } from "../../../hooks/usePack";

export const PackProductoList = ({ categoria, type }) => {

  const [skip_page, setSkip] = useState(0);

  const location = useLocation().pathname;

  const design = location.split('/')[3] ? location.split('/')[3] : null;
  
  const { products } = useFetchPackItems(skip_page, setSkip, location, categoria, type)
  useEffect(() => {
    // Scroll hacia arriba al cargar la página
    window.scrollTo(0, 0);
  }, []);

  // console.log(products)
  const { pack, substrackProductFromPack } = usePack();
  const initialStatePack = pack.prductos ? pack.prductos.map((producto) => producto.name) : null;
  const [productosPack, setProductosPack] = useState(initialStatePack);
  const [isChecked, setIsChecked] = useState({});

  const handleCheckBoxChange = (event, product) => {
    const updatedCheckedItems = { ...isChecked, [product.name]: event.target.checked };
    setIsChecked(updatedCheckedItems);
    if (!event.target.checked) {
      substrackProductFromPack(product)
    }
  };

  return (
    <InfiniteScroll
      dataLength={ products ? products.length : 0}
      next={ () => setSkip(skip_page => skip_page + 30) }
      hasMore={ true }
      loader={ <h4></h4> }
    >

      <div className={styles.container}>
      {initialStatePack && productosPack.length !== 0 && typeof productosPack === "object" ? (
            <div className={styles.pack_products}>
              <h5>Medias seleccionadas</h5>
              <div className={styles.pack_products_checks}>
                {productosPack?.map((producto, index) => (
                  <label key={index}>
                    <input
                      type="checkbox"
                      value={producto}
                      checked={isChecked[producto] || true}
                      onChange={ () => handleCheckBoxChange(event, pack.prductos.filter( product => product.name === producto )[0])}
                      // defaultChecked={producto !== "" ? true : false}
                      
                    />
                    {producto !== "" ? producto : "Pendiente"}
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <></>
          )}
            <div className={styles.trancking_container}>
              <div className={ styles.products_container }>            
                {
                  Object.keys(products).map( producto => (
                    
                      <PackProductoCard 
                        key={ producto }
                        { ...products[producto] }

                      />
                  ))
                }
              </div>
            </div>
          </div>
    </InfiniteScroll>
  );
};
