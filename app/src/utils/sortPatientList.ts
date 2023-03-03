import { message } from "antd";
import { PatientType } from "../context/PatientsContext";

export const sortPatientsList = (patientsList: PatientType[]): PatientType[] => {
    // PLACE HOLDER : return the reversed list of patients
    message.success("Patients sorted");
    return [...patientsList.reverse()];
}