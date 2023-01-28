import React, { useState } from 'react';

export interface PatientType {
  id: string;
  name: string;
  dose: number;
  duration: number;
  isInjected: boolean;
  realInjectionTime: string;
}

export interface PatientsContextType {
  patientsList: PatientType[];
  addPatient: (newPatient: PatientType) => void;
  deletePatient: (id: string) => void;
  updatePatient: (newPatient: PatientType) => void;
  updatePatientsList: (newPatientsList: PatientType[]) => void;
}

const PatientsContext = React.createContext<PatientsContextType | null>(null);

const PatientsContextProvider: React.FC<React.ReactNode> = ({ children }) => {
  //patients list
  const [patientsList, setPatientsList] = useState<PatientType[]>([]);

  const addPatient = (newPatient: PatientType) => {
    setPatientsList(prevPatients => [...prevPatients, newPatient]);
  };

  const deletePatient = (id: string) => {
    setPatientsList(prevPatients => prevPatients.filter(item => item.id !== id));
  };

  const updatePatient = (patient: PatientType) => {
    setPatientsList((prevPatients: PatientType[]) => {
      let newPatientList = [...prevPatients];
      newPatientList.forEach((p, index) => {
        if (p.id === patient.id) {
          prevPatients[index] = { ...prevPatients[index], ...patient };
        }
      });

      return newPatientList;
    });
  };

  const updatePatientsList = (newPatientsList: PatientType[]) => {
    setPatientsList(newPatientsList);
  };

  return (
    <PatientsContext.Provider
      value={{
        patientsList,
        addPatient,
        deletePatient,
        updatePatient,
        updatePatientsList,
      }}
    >
      {children}
    </PatientsContext.Provider>
  );
};

export { PatientsContextProvider, PatientsContext };
