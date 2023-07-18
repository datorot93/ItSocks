import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';


import styles from './../styles/MigaDePan.module.css';

export const MigaDePan = () => {

  const location = useLocation();
  
  // const pathname_array = pathname.pathname.replace('_', ' ').split('/').slice(1);
  const pathnames = location.pathname.replace('_', ' ').replace('%20', ' ').split('/').filter((x) => x.charAt(0));;
  
  // console.log(pathname.pathname);
  
  
  // const arrPath = ['Home', ...pathname_array];

  // const condition = location.pathname == "/";

  
  return (
      <div className={ styles.miga_container }>
        
        <div className={ styles.miga }>
          <Link to="/">{'Inicio'}</Link>
        {pathnames.map((path, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;

          return (
              <Link key={ index } to={routeTo}>{' > '+ path + ' ' }</Link>
              
              );
            })}
        </div>
      
        {/* {
          !condition
          ? <div className={ styles.miga_container } key={ Math.floor(Math.random() * 99999999) }>
          <div className={ styles.miga } key={ Math.floor(Math.random() * 99999999) }>
            {
              arrPath.map( path => (
                <div key={ path }>
                  <Link key={ path } to={ (path === 'Home') ? '/' : path }>{ path }</Link> {"| "}
                </div>
              ))
            }
          </div>
        </div>
        : <></>
        } */}

        
      </div>
    
    
  )
}
