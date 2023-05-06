import { PatientType } from "../context/PatientsContext";
import { RpSettingsType } from "../context/RpSettingsContext";
import { FutureStatsType } from "../context/StatisticsContext";
import { moveInjectedToListHead } from "./helpers";
import { activityAtFirstInj, decay, diffMsTimeMinutes, generatePatientInjTimeList, usableActivity } from "./maths";


/**
* Outputs a prediction for the
* @param {PatientType[]} patientList - The list of patients
* @param {RpSettingsType} rpSettings - the general settings for the system
* @param {Date} firstInjectionTime - (optional) The Date for injecting the first pattient in the list
*/
export const predict = (patientList: PatientType[], rpSettings: RpSettingsType, firstInjectionTime: Date = new Date()): FutureStatsType => {

    // move injected patients to the head of the list
    moveInjectedToListHead(patientList);

    // generate the patients injection time
    generatePatientInjTimeList(
        patientList,
        firstInjectionTime,
        rpSettings
    );

    // init FutureStatsType
    const futureStats: FutureStatsType = {
        totalExpectedInjectedPatients: 0,
        totalRemainingVol: rpSettings.rpVol,
        usableRemainingVol: rpSettings.rpVol - rpSettings.wastedVol - rpSettings.unextractableVol,

        remainingActivityTime: patientList[0].expectedInjectionTime ?? rpSettings.mesureTime,
        totalRemainingActivity: activityAtFirstInj(
            patientList.map(patient => (patient.expectedInjectionTime?.getTime())),
            rpSettings
        ),
        usableRemainingActivity: (rpSettings.rpVol - rpSettings.wastedVol - rpSettings.unextractableVol / rpSettings.rpVol) * activityAtFirstInj(
            patientList.map(patient => (patient.expectedInjectionTime?.getTime())),
            rpSettings
        ),
    }

    // if we reach a patient we cannot inject; we no longer check the other patients in the list
    let hasReachedUninjectablePatient = false;

    // iterate through the patient list and update the futureStats
    patientList.forEach((patient, index, patientList) => {

        if (hasReachedUninjectablePatient) {
            return;
        }

        // this should never happen, but it's a safenet in case generatePatientInjTimeList fails
        if (!patient.expectedInjectionTime || patient.expectedInjectionTime.getTime() > futureStats.remainingActivityTime.getTime()) {
            throw new Error("Cannot inject while previous PET scan ongoing")
        }

        // we calculate the usable activity at injection time
        const usableActivityAtInjection = decay(
            futureStats.usableRemainingActivity,
            rpSettings.rpHalfLife,
            diffMsTimeMinutes(futureStats.remainingActivityTime.getTime(), patient.expectedInjectionTime.getTime())
        )

        if (patient.dose > usableActivityAtInjection) {
            hasReachedUninjectablePatient = true;
            return;
        }

        // We can inject current patient :
        futureStats.totalExpectedInjectedPatients += 1;

        // the volume of the injection
        const injectionVol = (patient.dose / usableActivityAtInjection) * futureStats.usableRemainingVol;
        patientList[index].expectedInjectionVolume = injectionVol;

        futureStats.totalRemainingVol -= injectionVol;
        futureStats.usableRemainingVol -= injectionVol;

        futureStats.usableRemainingActivity = decay(
            usableActivityAtInjection - patient.dose,
            rpSettings.rpHalfLife,
            patient.duration
        )

        futureStats.totalRemainingActivity = futureStats.usableRemainingActivity * (futureStats.totalRemainingVol / futureStats.usableRemainingVol)

        futureStats.remainingActivityTime = new Date(patient.expectedInjectionTime.getTime() + patient.duration * 60000)
    })

    return futureStats;
};