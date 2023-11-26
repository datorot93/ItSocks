import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from './App';

import './assets/fonts/Montserrat/static/Montserrat-Bold.ttf';
import './assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf';
import './assets/fonts/Montserrat/static/Montserrat-Regular.ttf';



ReactDOM.createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
      <App />
    </BrowserRouter>
  
)
