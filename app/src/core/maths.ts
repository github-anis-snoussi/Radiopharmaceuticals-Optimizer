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

/**
* Calculates usable radioactivity when injecting the first patient
* @param {number[]} patientInjTimeMsList - List of injection times timestaps
* @param {RpSettingsType} rpSettings - the general settings for the system
*/
export const activityAtFirstInj = (patientInjTimeMsList: (number | undefined)[], rpSettings: RpSettingsType): number => {

    if (!patientInjTimeMsList || patientInjTimeMsList.length === 0 || !patientInjTimeMsList[0]) {
        return usableActivity(rpSettings.rpActivity, rpSettings.rpVol, rpSettings.wastedVol + rpSettings.unextractableVol)
    }

    if (rpSettings.mesureTime.getTime() > patientInjTimeMsList[0]) {
        throw new Error("Patient injected before measure time")
    }

    const totalActivity = decay(
        rpSettings.rpActivity,
        rpSettings.rpHalfLife,
        diffMsTimeMinutes(patientInjTimeMsList[0], new Date(rpSettings.mesureTime).getTime())
    );
    const remainingActivity = usableActivity(totalActivity, rpSettings.rpVol, rpSettings.wastedVol + rpSettings.unextractableVol)
    return remainingActivity;
};

/**
* Given a first injection time, update the patients expected injection time 
* @param {PatientType[]} patientList - List of patients list
* @param {Date} date - Date object for the first injection time
* @param {RpSettingsType} rpSettings - the general settings for the system
*/
export const generatePatientInjTimeList = (
    patientList: PatientType[],
    date: Date,
    rpSettings: RpSettingsType
): void => {

    if (date.getTime() < rpSettings.mesureTime.getTime()) {
        throw new Error("Cannot inject patient before measure time.")
    }

    const firstInjectedPatientIndex = patientList.findIndex(patient => patient.isInjected === false);
    const firstHalf = patientList.slice(0, firstInjectedPatientIndex);
    const lastHalf = patientList.slice(firstInjectedPatientIndex, patientList.length);

    if (firstInjectedPatientIndex !== -1) {
        if (firstHalf.some(patient => patient.isInjected === false) || lastHalf.some(patient => patient.isInjected === true)) {
            throw new Error("Injected pataients should always be at the first of the list")
        }
    }

    patientList.forEach((patient: PatientType, index: number) => {
        if (patient.isInjected) {
            if (!patient.realInjectionTime) {
                throw new Error("Patient injected but missing real injection time")
            }
            patientList[index].expectedInjectionTime = patient.realInjectionTime;
        } else if (index === 0) {
            patientList[index].expectedInjectionTime = new Date(date.getTime());
        } else {
            patientList[index].expectedInjectionTime = new Date((patientList[index - 1].expectedInjectionTime ?? new Date()).getTime() + patientList[index - 1].duration * 60000)
        }

    })
};