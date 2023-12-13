//REACT
import React, { useEffect, useRef, useState } from "react";

// ACTIONS
import { getProductsBySubCategory } from "../helpers/getProductsBySubCategory";
import { getProductsList } from "../../actions/getProductsList";

//UTILITIES
import { types } from "../../types/types";

//REACT-REDUX
import { useDispatch, useSelector } from "react-redux";

import { ProductoList } from "../components/ProductoList";

import styles from "../../ui/styles/Accesorios.module.css";
import { ProductFilter } from "../components/ProductFilter";
import { useLocation } from "react-router-dom";

export const Productos = ({ categoria, subcategoria, type }) => {
  const mounted = useRef(true);
  const dispatch = useDispatch();

  const location = useLocation().pathname;

  // console.log(location.split('/')[4].toLowerCase())

  const [skip_page, setSkip] = useState(0);
  const [loading, setLoading] = useState(true);
  // const [products, setProducts] = useState(null);

  const fetchItems = () => {
    setLoading(true);
    if (!subcategoria) {
      setLoading(true);
      dispatch(
        getProductsList(
          categoria,
          null,
          null,
          skip_page
        )
      ).then( () => {
        setSkip(skip_page => skip_page + 60);
        setLoading(false);
      });
    } else {
      setLoading(true);
      dispatch(
        getProductsList(categoria, subcategoria, type, skip_page)
      ).then( () => {
        setSkip(skip_page => skip_page + 60);
        setLoading(false)
      });
    }
    
  }

  useEffect(() => {
    fetchItems();
    if(location.split('/').length == 5){
      dispatch(
        {
          type: types.loadProducts, 
          payload: products.filter( 
            producto => producto.design.toLowerCase() === location.split('/')[4].toLowerCase() 
          )
        })
    }
    return () => {
      dispatch({type: types.unmountProducts })
    }
  }, []);



  const products = useSelector((state) => state.product.products);

  // console.log(products.filter())
  // HANDLE SCROLL
  const handleScroll = () => {
    const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
    const documentHeight = document.documentElement.offsetHeight;

    // console.log(documentHeight)

    if (scrollPosition === documentHeight && !loading) {
      fetchItems();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.trancking_container}>
            <h1>{categoria?.toUpperCase()} </h1>
            </div>
              {

                products ?
                <>
                {/* <ProductoList products={products} />
                      <ProductFilter
                        products={products}
                        subcategoria={subcategoria}
                        categoria={categoria}
                        type={type}
                      /> */}
                  {
                    location.split('/').length !== 5?
                    <>
                      <ProductoList products={products} />
                      <ProductFilter
                        products={products}
                        subcategoria={subcategoria}
                        categoria={categoria}
                        type={type}
                      />
                    </>
                    :<>
                      <ProductoList 
                        products={
                          products.filter( 
                            producto => producto.design.toLowerCase() === location.split('/')[4].toLowerCase() 
                          )
                        } 
                      />
                      <ProductFilter
                        products={products}
                        subcategoria={subcategoria}
                        categoria={categoria}
                        type={type}
                      />
                    </>
                  }
                  
                </>
                :<></>
              }
          
        </div>
      </div>
    </>
  );
};
