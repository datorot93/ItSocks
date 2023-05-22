import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';


import styles from './../styles/MigaDePan.module.css';

export const MigaDePan = () => {

  const pathname = useLocation();
  
  // const pathname_array = pathname.pathname.replace('_', ' ').split('/').slice(1);
  const pathname_array = pathname.pathname.replace('_', ' ').split('/').filter((x) => x.charAt(0));;
  
  // console.log(pathname.pathname);
  
  
  const arrPath = ['Home', ...pathname_array];

  const condition = pathname.pathname == "/";

  console.log(condition)
  // console.log( arrPath );
  return (
      <>
        {
          !condition
          ? <div className={ styles.miga_container }>
          <div className={ styles.miga } key="miga">
            {
              arrPath.map( (path, index) => (
                <>
                  <Link key={ path } to={ (path === 'Home') ? '/' : path }>{ path }</Link> | {" "}
                </>
              ))
            }
          </div>
        </div>
        : <></>
        }
        
      </>
    
    
  )
}
