import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals.ts";
import BuildingsFactoryCreator from "./components/buildingFactory/buildings_factory.tsx";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BuildingsFactoryCreator />
  </React.StrictMode>
);

reportWebVitals();
