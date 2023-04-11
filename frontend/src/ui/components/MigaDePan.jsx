import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';


import styles from './../styles/MigaDePan.module.css';

export const MigaDePan = () => {

  const { pathname } = useLocation();
  // console.log( pathname );
  
  const pathname_array = pathname.replace('_', ' ').split('/').slice(1);
  // console.log(pathname_array);
  
  
  const arrPath = ['Home', ...pathname_array];

  return (
    <div className={ styles.miga_container }>
      <div className={ styles.miga } key="miga">
        {
          arrPath.map( path => (
            <>
              <Link key={ path } to={ (path === 'Home') ? '/' : path }>{ path }</Link> | {" "}
            </>
          ))
        }
      </div>
    </div>
  )
}
