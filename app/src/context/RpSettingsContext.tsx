import React, { useState } from "react";

export interface RpSettingsType {
  rpActivity: number;
  mesureTime: string | null;
  firstInjTime: string | null;
  rpHalfLife: number;
  rpVol: number;
  wastedVol: number;
  unextractableVol: number;
  labName: string;
}

export interface GloabContextType {
  rpSettings: RpSettingsType;
  setRpSettings: (settings: RpSettingsType) => void;
}

const RpSettingsContextContext = React.createContext<GloabContextType | null>(
  null
);

const RpSettingsContextProvider: React.FC<React.ReactNode> = ({ children }) => {
  // rpSettings
  const [rpActivity, setRpActivity] = useState<number>(0);
  const [mesureTime, setMesureTime] = useState<string | null>(null);
  const [firstInjTime, setFirstInjTime] = useState<string | null>(null);
  const [rpHalfLife, setRpHalfLife] = useState<number>(0);
  const [rpVol, setRpVol] = useState<number>(0);
  const [wastedVol, setWastedVol] = useState<number>(0);
  const [unextractableVol, setUnextractableVol] = useState<number>(0);
  const [labName, setLabName] = useState<string>("Rp Optimizer");

  const setRpSettings = ({
    rpActivity,
    mesureTime,
    firstInjTime,
    rpHalfLife,
    rpVol,
    wastedVol,
    unextractableVol,
    labName,
  }: RpSettingsType) => {
    if (rpActivity) {
      setRpActivity(rpActivity);
    }
    if (mesureTime) {
      setMesureTime(mesureTime);
    }
    if (firstInjTime) {
      setFirstInjTime(firstInjTime);
    }
    if (rpHalfLife) {
      setRpHalfLife(rpHalfLife);
    }
    if (rpVol) {
      setRpVol(rpVol);
    }
    if (wastedVol) {
      setWastedVol(wastedVol);
    }
    if (unextractableVol) {
      setUnextractableVol(unextractableVol);
    }
    if (labName) {
      setLabName(labName);
    }
  };

  return (
    <RpSettingsContextContext.Provider
      value={{
        rpSettings: {
          rpActivity,
          mesureTime,
          firstInjTime,
          rpHalfLife,
          rpVol,
          wastedVol,
          unextractableVol,
          labName,
        },
        setRpSettings,
      }}
    >
      {children}
    </RpSettingsContextContext.Provider>
  );
};

export { RpSettingsContextProvider, RpSettingsContextContext };
