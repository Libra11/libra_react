/**
 * Author: Libra
 * Date: 2023-12-05 11:11:14
 * LastEditors: Libra
 * Description:
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { store } from "@/store";
import { Provider } from "react-redux";
import "./style/index.css";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

const persistor = persistStore(store);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <React.StrictMode>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </React.StrictMode>
  </Provider>
);
