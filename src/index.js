import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // <--- ДОБАВИТЬ ЭТУ СТРОКУ
import App from './App';
// ...import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);