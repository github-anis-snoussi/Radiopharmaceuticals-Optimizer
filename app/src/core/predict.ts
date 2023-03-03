import { PatientType } from "../context/PatientsContext";
import { RpSettingsType } from "../context/RpSettingsContext";
import { activityAtFirstInj, decay, diffTimeMinutes, generatePatientInjTimeList, usableActivity } from "./maths";


export const calculFinalExpectedActivity = (patientList: PatientType[], rpSettings: RpSettingsType) => {
    patientList = patientList.map((x: any) => ({
        ...x,
        realInjectionTime: x.realInjectionTime
            ? new Date(x.realInjectionTime)
            : null,
    }));

    let patientDoseList = patientList.map((x: any) => x.dose);
    let patientScanTimeList = patientList.map((x: any) => x.duration);
    let patientInjTimeList = generatePatientInjTimeList(
        patientList,
        patientScanTimeList,
        rpSettings
    );

    patientDoseList.push(0);

    let injTimeActivityList = Array(patientDoseList.length).fill(0);
    let remainingActivityList = [...injTimeActivityList];
    let patientInjVolList = [...injTimeActivityList];
    let remainingVolList = [...injTimeActivityList];

    patientDoseList.forEach((x: any, i: any) => {
        if (i === 0) {
            injTimeActivityList[i] = activityAtFirstInj(
                patientInjTimeList,
                rpSettings
            );
            remainingActivityList[i] = injTimeActivityList[i] - patientDoseList[i];
            patientInjVolList[i] =
                (patientDoseList[i] * (rpSettings.rpVol - rpSettings.wastedVol)) /
                injTimeActivityList[i];
            remainingVolList[i] =
                rpSettings.rpVol - rpSettings.wastedVol - patientInjVolList[i];
        } else {
            injTimeActivityList[i] = decay(
                remainingActivityList[i - 1],
                rpSettings.rpHalfLife,
                diffTimeMinutes(patientInjTimeList[i], patientInjTimeList[i - 1])
            );
            remainingActivityList[i] = injTimeActivityList[i] - patientDoseList[i];
            patientInjVolList[i] =
                (patientDoseList[i] * remainingVolList[i - 1]) / injTimeActivityList[i];
            remainingVolList[i] = remainingVolList[i - 1] - patientInjVolList[i];
        }
    });

    const usableRemainingActivity = usableActivity(
        remainingActivityList.slice(-1)[0],
        remainingVolList.slice(-1)[0],
        rpSettings.unextractableVol
    );
    patientInjVolList.pop();
    const expected = {
        totalRemainingActivity: remainingActivityList.slice(-1)[0].toFixed(0),
        usableRemainingActivity: usableRemainingActivity.toFixed(0),

        totalRemainingVol: remainingVolList.slice(-1)[0].toFixed(2),
        usableRemainingVol: (
            remainingVolList.slice(-1)[0] - rpSettings.unextractableVol
        ).toFixed(2),

        remainingActivityTime: new Date(patientInjTimeList.slice(-1)[0]),

        patientInjTimeList: patientInjTimeList.slice(0, -1).map((x) => new Date(x)), // a new column
        patientInjVolList: patientInjVolList, // a new column
    };

    return expected;
};