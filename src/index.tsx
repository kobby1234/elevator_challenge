import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import ConcreteCreator1 from "./components/buildings_factory.tsx";

const product = new ConcreteCreator1();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
   {product.someOperation()}
  </React.StrictMode>
);


reportWebVitals();
