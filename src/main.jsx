import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import setupInterceptors from "./services/interceptors";

const container = document.getElementById("root");
const root = createRoot(container);

setupInterceptors(store);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <UserProvider>
        <App />
      </UserProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();