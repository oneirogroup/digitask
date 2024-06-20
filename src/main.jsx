import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { store, persistor } from './app/store'
import { Provider } from 'react-redux'
import { PersistGate } from "redux-persist/integration/react";
import axios from 'axios';


const token = localStorage.getItem('access_token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)


