import { PatientType } from "../context/PatientsContext";

export const sortingAfterEveryInjection = (patientList: any) => {
    const compare = (a: PatientType, b: PatientType) => {
        if (!a.realInjectionTime && !b.realInjectionTime) return 0
        if (!a.realInjectionTime || !b.realInjectionTime) return a.realInjectionTime ? -1 : 1;

        return new Date(a.realInjectionTime).getTime() - new Date(b.realInjectionTime).getTime()
    }
    patientList.sort(compare);
};