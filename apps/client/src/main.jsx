import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import { UserProvider } from "./contexts/UserContext";
import * as serviceWorker from "./serviceWorker";
import setupInterceptors from "./services/interceptors";
import store from "./store";

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
  document.getElementById("root")
);

serviceWorker.unregister();