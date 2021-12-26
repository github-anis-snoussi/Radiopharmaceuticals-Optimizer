import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  // rp_settings
  settings: {
    rp_activity: 0,
    mesure_time: null,
    first_inj_time: null,
    rp_half_life: 0,
    rp_vol: 0,
    wasted_vol: 0,
    unextractable_vol: 0,
    name: "Rp Optimizer",
  },

  //patients list
  patientsList: [],

  // expectations values
  expected: {},
  now: {},

  // the user unique id for amplitude
  uid: uuidv4(),
};

const Context = React.createContext();

function ContextProvider({ children }) {
  const [settings, setSettings] = useState(initialState.settings);
  const [patientsList, setPatientsList] = useState(initialState.patientsList);
  const [expected, setExpected] = useState(initialState.expected);
  const [now, setNow] = useState(initialState.now);
  const [uid, setUid] = useState(initialState.uid);

  // Local Storage: setting & getting data
  useEffect(() => {
    const savedContext = JSON.parse(localStorage.getItem("ContextRPO"));

    if (savedContext) {
      setSettings(savedContext.settings);
      setPatientsList(savedContext.patientsList);
      setExpected(savedContext.expected);
      setNow(savedContext.now);
      setUid(savedContext.uid);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "ContextRPO",
      JSON.stringify({ settings, patientsList, expected, now, uid })
    );
  }, [settings, patientsList, expected, now, uid]);

  return (
    <Context.Provider
      value={{
        settings,
        patientsList,
        expected,
        now,
        uid,
        setSettings,
        setPatientsList,
        setExpected,
        setNow,
        setUid,
      }}
    >
      {children}
    </Context.Provider>
  );
}

const withContext = (Child) => (props) =>
  (
    <Context.Consumer>
      {(context) => <Child {...props} RPO={{ ...context }} />}
    </Context.Consumer>
  );

export { ContextProvider, withContext };
