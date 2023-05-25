import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';


import styles from './../styles/MigaDePan.module.css';

export const MigaDePan = () => {

  const pathname = useLocation();
  
  // const pathname_array = pathname.pathname.replace('_', ' ').split('/').slice(1);
  const pathname_array = pathname.pathname.replace('_', ' ').replace('%20', ' ').split('/').filter((x) => x.charAt(0));;
  
  // console.log(pathname.pathname);
  
  
  const arrPath = ['Home', ...pathname_array];

  const condition = pathname.pathname == "/";
  return (
      <div key={ Math.floor(Math.random() * 99999999) }>
        {
          !condition
          ? <div className={ styles.miga_container } key={ Math.floor(Math.random() * 99999999) }>
          <div className={ styles.miga } key={ Math.floor(Math.random() * 99999999) }>
            {
              arrPath.map( (path) => (
                <>
                  <Link key={ Math.floor(Math.random() * 99999999) } to={ (path === 'Home') ? '/' : path }>{ path }</Link> {"| "}
                </>
              ))
            }
          </div>
        </div>
        : <></>
        }
        
      </div>
    
    
  )
}
