import { PatientType } from "../context/PatientsContext";
import { RpSettingsType } from "../context/RpSettingsContext"

/**
* Returns the difference in minutes between two dates in ms
* @param {number} date1 - The start time in ms
* @param {number} date1 - The end time in ms
*/
export const diffMsTimeMinutes = (date1: number, date2: number) => {
    const diffMs = Math.abs(date1 - date2);
    const diffMinutes = Math.round(diffMs / 60000);
    return diffMinutes;
};

export const decay = (a0: number, halfLife: number, t: number) => {
    const a = a0 * Math.exp((-Math.log(2) * t) / halfLife);
    return a;
};

export const activityAtFirstInj = (patientInjTimeList: number[], rpSettings: RpSettingsType) => {
    const ta = decay(
        rpSettings.rpActivity,
        rpSettings.rpHalfLife,
        diffMsTimeMinutes(patientInjTimeList[0], new Date(rpSettings.mesureTime).getTime())
    );
    const ra =
        (ta * (rpSettings.rpVol - rpSettings.wastedVol)) / rpSettings.rpVol;
    return ra;
};

export const usableActivity = (totalRpActivity: number, totalRpVol: number, unextractableRpVol: number) => {
    return (totalRpActivity * (totalRpVol - unextractableRpVol)) / totalRpVol;
};

export const generatePatientInjTimeList = (
    patientList: PatientType[],
    patientScanTimeList: number[],
    rpSettings: RpSettingsType
): number[] => {

    patientScanTimeList.push(0);
    let patientInjTimeList = Array(patientScanTimeList.length).fill(0);
    patientList.push({
        id: 'filler-patient-id',
        name: 'placeholder patient',
        dose: 0,
        duration: 0,
        isInjected: false,
    });

    patientList.forEach((patient: PatientType, index: number) => {
        if (patient.isInjected) {
            patientInjTimeList[index] = patient.realInjectionTime;
        } else if (index === 0) {
            patientInjTimeList[index] = rpSettings.firstInjTime;
        } else {
            patientInjTimeList[index] = new Date(patientInjTimeList[index - 1]).setMinutes(
                new Date(patientInjTimeList[index - 1]).getMinutes() +
                patientScanTimeList[index - 1]
            );
        }
    });

    patientScanTimeList.pop();
    patientList.pop();

    return patientInjTimeList;
};