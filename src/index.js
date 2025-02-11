import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './js/App';
import reportWebVitals from './js/reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();