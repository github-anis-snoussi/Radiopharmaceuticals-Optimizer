import { message } from "antd";
import { PatientType } from "../context/PatientsContext";
import { RpSettingsType } from "../context/RpSettingsContext";
import { sortingAfterEveryInjection } from "./helpers";
import { predict } from "./predict";


const firstSorting = (patientList: PatientType[]) => {
    return patientList.sort((a, b) => {
        let aRatio = a.isInjected ? 0 : a.duration / a.dose;
        let bRatio = b.isInjected ? 0 : b.duration / b.dose;
        return aRatio - bRatio;
    });
};

const secondSorting = (patientList: PatientType[], rpSettings: RpSettingsType) => {
    let sortingCondition = true;
    while (sortingCondition) {
        sortingCondition = false;
        for (let i = 0; i < patientList.length - 1; i++) {
            if (patientList[i].isInjected === false) {
                // some logging
                // console.log("=============================")
                // console.log(`+++ Swapping [${i}] & [${i+1}] +++`)
                // console.log("=============================")

                let before = predict(
                    patientList,
                    rpSettings
                ).usableRemainingActivity;

                // final activity before swapping
                // console.log(`==> BEFORE : ${before}`)

                // looks like fancy shit didnt work, back to the old ways
                let aux1 = patientList[i];
                patientList[i] = patientList[i + 1];
                patientList[i + 1] = aux1;

                let after = predict(
                    patientList,
                    rpSettings
                ).usableRemainingActivity;

                // final activity after swapping
                // console.log(`==> AFTER : ${after}`)

                if (parseInt(before, 10) >= parseInt(after, 10)) {
                    // console.log("<|-|-|-| FINISHED |-|-|-|>")

                    let aux2 = patientList[i];
                    patientList[i] = patientList[i + 1];
                    patientList[i + 1] = aux2;
                } else {
                    // console.log("<|-|-|-| CONTINUE |-|-|-|>")

                    sortingCondition = true;
                }
            }
        }
    }
};

export const sort = (patientListOg: PatientType[], rpSettings: RpSettingsType): PatientType[] => {
    let patientList = [...sortingAfterEveryInjection(patientListOg)];

    let sortedList = firstSorting(patientList);
    // secondSorting(sortedList, rpSettings);
    message.success("Patients sorted");
    return sortedList;
};
