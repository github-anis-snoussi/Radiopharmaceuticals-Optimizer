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

  //patients list
  const [patientsList, setPatientsList] = useState([]);

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

  const addPatient = (newPatient) => {
    setPatientsList(prevPatients => [...prevPatients, newPatient])
  }

  const deletePatient = (id) => {
    setPatientsList(prevPatients => prevPatients.filter(item => item.id !== id))
  }

  const updatePatient = (patient) => {
    setPatientsList(prevPatients => prevPatients.forEach((p, index) => {
      if(p.id === patient.id) {
          prevPatients[index] = patient;
      }
    }))
  }

  const deletePatientsList = (newPatientsList) => {
    setPatientsList(newPatientsList)
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
        patientsList,
        addPatient,
        deletePatient,
        updatePatient,
        deletePatientsList,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export { ContextProvider, Context };
