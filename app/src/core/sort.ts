import { message } from "antd";
import { PatientType } from "../context/PatientsContext";
import { RpSettingsType } from "../context/RpSettingsContext";
import { moveInjectedToListHeadHelper } from "./helpers";
import { predict } from "./predict";


const greedySort = (patientList: PatientType[]) => {
    return patientList.sort((a, b) => {
        let aRatio = a.isInjected ? 0 : a.duration / a.dose;
        let bRatio = b.isInjected ? 0 : b.duration / b.dose;
        return aRatio - bRatio;
    });
};

const slidingWindowSort = (patientList: PatientType[], rpSettings: RpSettingsType) => {
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

                if (before >= after) {
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

/**
* Plugable sort function, will output the best order to inject patients using a limited supply of radioactive substance
* @param {PatientType[]} patientList - The list of patients
* @param {RpSettingsType} rpSettings - the general settings for the system
*/
export const sort = (patientListOg: PatientType[], rpSettings: RpSettingsType): PatientType[] => {
    moveInjectedToListHeadHelper(patientListOg);

    let sortedList = greedySort([...patientListOg]);
    slidingWindowSort(sortedList, rpSettings);
    message.success("Patients sorted");
    return [...sortedList];
};
