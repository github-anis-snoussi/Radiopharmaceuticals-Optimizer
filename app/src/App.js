import React from "react";

import "./App.css";
import "./index.css";
import "antd/dist/antd.css";

import Dashboard from "./Components/Dashboard";
import { ContextProvider } from "./utils/savableContext";

const App = () => {
  return (
    <ContextProvider>
      <Dashboard />
    </ContextProvider>
  );
};

export default App;
