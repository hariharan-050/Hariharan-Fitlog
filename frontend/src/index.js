import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import axios from 'axios';
import store from './store';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Configure Axios defaults for direct Spring Boot backend communication
if (axios.defaults) {
  axios.defaults.baseURL = 'http://localhost:8080';
}

// Global request interceptor to attach JWT token to all outbound Axios calls
if (axios.interceptors && axios.interceptors.request) {
  axios.interceptors.request.use(
    (config) => {
      if (typeof localStorage !== 'undefined') {
        const token = localStorage.getItem('fitlog_token');
        if (token && token !== 'mock-jwt-token-preview' && config.headers && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}

// Global response interceptor to handle 401 / 403 session expirations
if (axios.interceptors && axios.interceptors.response) {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        if (typeof localStorage !== 'undefined') {
          const currentToken = localStorage.getItem('fitlog_token');
          if (currentToken === 'mock-jwt-token-preview') {
            localStorage.removeItem('fitlog_token');
            localStorage.removeItem('fitlog_username');
            localStorage.removeItem('fitlog_role');
          }
        }
      }
      return Promise.reject(error);
    }
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
