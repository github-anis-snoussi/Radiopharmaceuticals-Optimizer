// Providing Context
// ==================

import React, { useState } from "react";

const Context = React.createContext();

function ContextProvider({ children }) {
  // rpSettings
  const [rpActivity, setRpActivity] = useState(0);
  const [mesureTime, setMesureTime] = useState(null);
  const [firstInjTime, setFirstInjTime] = useState(null);
  const [rpHalfLife, setRpHalfLife] = useState(0);
  const [rpVol, setRpVol] = useState(0);
  const [wastedVol, setWastedVol] = useState(0);
  const [unextractableVol, setUnextractableVol] = useState(0);
  const [labName, setLabName] = useState("Rp Optimizer");

  return (
    <Context.Provider
      value={{
        rpActivity,
        setRpActivity,
        mesureTime,
        setMesureTime,
        firstInjTime,
        setFirstInjTime,
        rpHalfLife,
        setRpHalfLife,
        rpVol,
        setRpVol,
        wastedVol,
        setWastedVol,
        unextractableVol,
        setUnextractableVol,
        labName,
        setLabName,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export { ContextProvider, Context };
