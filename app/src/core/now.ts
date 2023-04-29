import { PatientType } from "../context/PatientsContext";
import { RpSettingsType } from "../context/RpSettingsContext";
import { activityAtFirstInj, decay, diffMsTimeMinutes, usableActivity } from "./maths";

export const now = (patientList: PatientType[], rpSettings: RpSettingsType) => {
    let nowDict: any = {};

    let injectedPatientsList = patientList.filter((x: any) => x.isInjected);
    let k = injectedPatientsList.length;

    injectedPatientsList = injectedPatientsList.map((x: any) => ({
        ...x,
        realInjectionTime: x.realInjectionTime
            ? new Date(x.realInjectionTime)
            : null,
    }));

    if (k === 0) {
        nowDict.totalVolNow = rpSettings.rpVol - rpSettings.wastedVol;
        nowDict.usableVolNow = nowDict.totalVolNow - rpSettings.unextractableVol;
        nowDict.totalActivityNowBeforePrime = decay(
            rpSettings.rpActivity,
            rpSettings.rpHalfLife,
            diffMsTimeMinutes(new Date().getTime(), new Date(rpSettings.mesureTime).getTime())
        );
        nowDict.totalActivityNow =
            (nowDict.totalActivityNowBeforePrime * nowDict.totalVolNow) /
            rpSettings.rpVol;
        nowDict.usableActivityNow = usableActivity(
            nowDict.totalActivityNow,
            nowDict.totalVolNow,
            rpSettings.unextractableVol
        );
    } else {
        let patientDoseList = injectedPatientsList.map((x: any) => x.dose);
        let patientInjTimeList = injectedPatientsList.map(
            (x: any) => x.realInjectionTime
        );
        let injTimeActivityList = Array(k).fill(0);
        let remainingActivityList = Array(k).fill(0);
        let patientInjVolList = Array(k).fill(0);
        let remainingVolList = Array(k).fill(0);

        for (var i = 0; i < k; i++) {
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
                    diffMsTimeMinutes(patientInjTimeList[i], patientInjTimeList[i - 1])
                );
                remainingActivityList[i] = injTimeActivityList[i] - patientDoseList[i];
                patientInjVolList[i] =
                    (patientDoseList[i] * remainingVolList[i - 1]) /
                    injTimeActivityList[i];
                remainingVolList[i] = remainingVolList[i - 1] - patientInjVolList[i];
            }
        }

        nowDict.totalVolNow = remainingVolList[k - 1];
        nowDict.usableVolNow =
            remainingVolList[k - 1] - rpSettings.unextractableVol;
        nowDict.totalActivityNow = decay(
            remainingActivityList[k - 1],
            rpSettings.rpHalfLife,
            diffMsTimeMinutes(new Date().getTime(), patientInjTimeList[k - 1])
        );
        nowDict.usableActivityNow = usableActivity(
            nowDict.totalActivityNow,
            remainingVolList[k - 1],
            rpSettings.unextractableVol
        );
    }

    return nowDict;
};
