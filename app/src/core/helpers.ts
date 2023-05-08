import { PatientType } from "../context/PatientsContext";
import { RpSettingsType } from "../context/RpSettingsContext";
import { decay, diffMsTimeMinutes, generatePatientInjTimeList } from "./maths";

/**
* Moves the injected patients to the head of the list.
* @param {PatientType[]} patientList - The list of patients
*/
export const moveInjectedToListHeadHelper = (patientList: PatientType[]): void => {
    const compare = (a: PatientType, b: PatientType) => {
        if (!a.realInjectionTime && !b.realInjectionTime) return 0
        if (!a.realInjectionTime || !b.realInjectionTime) return a.realInjectionTime ? -1 : 1;

        return a.realInjectionTime.getTime() - b.realInjectionTime.getTime()
    }
    patientList.sort(compare);
};

/**
* Inject patient based on Id and return new list
* @param {PatientType[]} patientList - The list of patients
* @param {RpSettingsType} rpSettings - the general settings for the system
* @param {string} patientId - The id of the patient to inject
* @param {string | null} injectionTime - The timestamp for time of the injection
*/
export const injectPatientHelper = (patientList: PatientType[], rpSettings: RpSettingsType, patientId: string, injectionTime: string | null): PatientType[] => {
    if (!injectionTime) {
        throw new Error('Please select Injection time first.');
    }

    const PatientToInject = patientList.find((patient) => patient.id === patientId);

    if (!PatientToInject) {
        throw new Error('Patient to inject does not exist.');
    }

    const InjectedPatients = patientList.slice().filter((patient) => patient.isInjected);
    const lastInjectedPatient = patientList.slice().reverse()[0]


    if (lastInjectedPatient?.realInjectionTime && ((lastInjectedPatient.realInjectionTime.getTime() + lastInjectedPatient.duration * 60 * 1000) > new Date(injectionTime).getTime())) {
        throw new Error('Last patient still in scan.');
    }

    const patientInjectionVol = PatientToInject.dose * (rpSettings.rpVol / decay(rpSettings.rpActivity, rpSettings.rpHalfLife, diffMsTimeMinutes(rpSettings.mesureTime.getTime(), new Date(injectionTime).getTime())))

    const newPatientList = patientList.map(patient => patient.id === patientId ? { ...patient, isInjected: true, realInjectionTime: new Date(injectionTime), realInjectionVolume: patientInjectionVol } : patient);

    moveInjectedToListHeadHelper(newPatientList);
    generatePatientInjTimeList(newPatientList, InjectedPatients[0]?.realInjectionTime ?? new Date(injectionTime), rpSettings)

    return [...newPatientList];
};