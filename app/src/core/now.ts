import { PatientType } from "../context/PatientsContext";
import { RpSettingsType } from "../context/RpSettingsContext";
import { NowStatsType } from "../context/StatisticsContext";
import { moveInjectedToListHeadHelper } from "./helpers";
import { decay, diffMsTimeMinutes } from "./maths";

/**
* Calculates the current state of the system
* @param {PatientType[]} patientList - The list of patients
* @param {RpSettingsType} rpSettings - the general settings for the system
*/
export const currentStats = (patientList: PatientType[], rpSettings: RpSettingsType): NowStatsType => {

    // move injected patients to the head of the list
    moveInjectedToListHeadHelper(patientList);

    const currentTime = new Date();

    const nowStats: NowStatsType = {
        totalVolNow: rpSettings.rpVol,
        usableVolNow: rpSettings.rpVol - rpSettings.unextractableVol - rpSettings.wastedVol,
        totalActivityNow: rpSettings.rpActivity,
        usableActivityNow: rpSettings.rpActivity * ((rpSettings.rpVol - rpSettings.unextractableVol - rpSettings.wastedVol) / rpSettings.rpVol),
    }

    // if measure time is in the future, we return unchanged settings
    if (rpSettings.mesureTime.getTime() > currentTime.getTime()) {
        console.warn("Measure Time is set in the Future");
        return nowStats;
    }

    const injectedPatientsList = patientList.filter((patient) => patient.isInjected && patient.realInjectionTime && patient.realInjectionTime.getTime() <= currentTime.getTime());

    injectedPatientsList.forEach((patient, index, patientList) => {
        if (!patient.realInjectionTime) {
            throw new Error("Patient is injected but realInjectionTime is not defined")
        }

        // if current time allows for injecting next patient
        // we first subtract activity lost waiting for the patient to be injected
        if (index === 0) {
            const totalActivityNow = decay(
                rpSettings.rpActivity,
                rpSettings.rpHalfLife,
                diffMsTimeMinutes(rpSettings.mesureTime.getTime(), patient.realInjectionTime.getTime())
            );
            nowStats.totalActivityNow = totalActivityNow;
            nowStats.usableActivityNow = totalActivityNow * ((rpSettings.rpVol - rpSettings.unextractableVol - rpSettings.wastedVol) / rpSettings.rpVol)
        } else {
            const previousPatient = patientList[index - 1]
            if (!previousPatient.realInjectionTime) {
                throw new Error("Patient is injected but realInjectionTime is not defined")
            }

            const totalActivityNow = decay(
                nowStats.totalActivityNow,
                rpSettings.rpHalfLife,
                diffMsTimeMinutes(previousPatient.realInjectionTime.getTime(), patient.realInjectionTime.getTime())
            );

            nowStats.totalActivityNow = totalActivityNow;
            nowStats.usableActivityNow = totalActivityNow * ((rpSettings.rpVol - rpSettings.unextractableVol - rpSettings.wastedVol) / rpSettings.rpVol)
        }

        // then we subtract the dose and volume used by the patient
        nowStats.totalVolNow -= patient.realInjectionVolume ?? 0
        nowStats.usableVolNow -= patient.realInjectionVolume ?? 0
        nowStats.totalActivityNow -= patient.dose
        nowStats.usableActivityNow -= patient.dose
    })

    // if we never reached a patient whose injected in the future, we calculate the decay after injecting all patients
    if (injectedPatientsList.length === 0) {
        const totalActivityNow = decay(
            nowStats.totalActivityNow,
            rpSettings.rpHalfLife,
            diffMsTimeMinutes(rpSettings.mesureTime.getTime(), currentTime.getTime())
        );

        nowStats.totalActivityNow = totalActivityNow;
        nowStats.usableActivityNow = totalActivityNow * ((rpSettings.rpVol - rpSettings.unextractableVol - rpSettings.wastedVol) / rpSettings.rpVol)
    }
    else {
        const lastPatient = injectedPatientsList.slice(-1)[0] as PatientType & { realInjectionTime: Date }
        const totalActivityNow = decay(
            nowStats.totalActivityNow,
            rpSettings.rpHalfLife,
            diffMsTimeMinutes(lastPatient.realInjectionTime.getTime(), currentTime.getTime())
        );

        nowStats.totalActivityNow = totalActivityNow;

        const usableActivityNow = decay(
            nowStats.usableActivityNow,
            rpSettings.rpHalfLife,
            diffMsTimeMinutes(lastPatient.realInjectionTime.getTime(), currentTime.getTime())
        );
        nowStats.usableActivityNow = usableActivityNow
    }


    return nowStats;
};
