import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { store, persistor } from './app/store'
import { Provider } from 'react-redux'
import { PersistGate } from "redux-persist/integration/react";
import axios from 'axios';
import { UserProvider } from './contexts/UserContext';


const accessToken = localStorage.getItem('access_token');
if (accessToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
}
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <UserProvider>
          <App />
        </UserProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)


