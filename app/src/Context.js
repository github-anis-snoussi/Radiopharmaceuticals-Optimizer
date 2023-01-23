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

  const setRpSettings = ({
    rpActivity,
    mesureTime,
    firstInjTime,
    rpHalfLife,
    rpVol,
    wastedVol,
    unextractableVol,
    labName
  }) => {
    if(rpActivity) {
      setRpActivity(rpActivity)
    }
    if(mesureTime) {
      setMesureTime(mesureTime)
    }
    if(firstInjTime) {
      setFirstInjTime(firstInjTime)
    }
    if(rpHalfLife) {
      setRpHalfLife(rpHalfLife)
    }
    if(rpVol) {
      setRpVol(rpVol)
    }
    if(wastedVol) {
      setWastedVol(wastedVol)
    }
    if(unextractableVol) {
      setUnextractableVol(unextractableVol)
    }
    if(labName) {
      setLabName(labName)
    }
  }

  return (
    <Context.Provider
      value={{
        rpActivity,
        mesureTime,
        firstInjTime,
        rpHalfLife,
        rpVol,
        wastedVol,
        unextractableVol,
        labName,
        setRpSettings,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export { ContextProvider, Context };
