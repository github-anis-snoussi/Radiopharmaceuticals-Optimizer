import { PatientType } from "../context/PatientsContext";
import { RpSettingsType } from "../context/RpSettingsContext"

/**
* Returns the difference in minutes between two dates in ms
* @param {number} date1 - The start time in ms
* @param {number} date1 - The end time in ms
*/
export const diffMsTimeMinutes = (date1: number, date2: number): number => {
    const diffMs = Math.abs(date1 - date2);
    const diffMinutes = Math.round(diffMs / 60000);
    return diffMinutes;
};

/**
* Calculates the radioactive decay A = A0 * e^(-ln(2/halfLife))t
* @param {number} a0 - The starting activity (MBq)
* @param {number} halfLife - the halflife value of the radioactive substance (min)
* @param {number} t - elapsed time (min)
*/
export const decay = (a0: number, halfLife: number, t: number): number => {
    const a = a0 * Math.exp((-Math.log(2) * t) / halfLife);
    return a;
};

/**
* Calculates the usable radioactivity given the total recieved radioactive substance, and the volume that cannot be extracted from the container
* @param {number} totalRpActivity - The total radioactivity of the recieved substance (MBq)
* @param {number} totalRpVol - The total volume of the recieved substance (ml)
* @param {number} unextractableRpVol - the volume of the substance that cannot be extracted from the container (ml)
*/
export const usableActivity = (totalRpActivity: number, totalRpVol: number, unextractableRpVol: number): number => {
    return (totalRpActivity * (totalRpVol - unextractableRpVol)) / totalRpVol;
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