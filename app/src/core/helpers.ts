import { PatientType } from "../context/PatientsContext";

/**
* Moves the injected patients to the head of the list.
* @param {PatientType[]} patientList - The list of patients
*/
export const moveInjectedToListHead = (patientList: PatientType[]): void => {
    const compare = (a: PatientType, b: PatientType) => {
        if (!a.realInjectionTime && !b.realInjectionTime) return 0
        if (!a.realInjectionTime || !b.realInjectionTime) return a.realInjectionTime ? -1 : 1;

        return a.realInjectionTime.getTime() - b.realInjectionTime.getTime()
    }
    patientList.sort(compare);
};