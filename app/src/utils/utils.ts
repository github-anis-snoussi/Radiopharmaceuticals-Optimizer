import { message } from "antd";
import { clean } from "./sortPatientList";
import { sendAmplitudeData, amplitudeLogsTypes } from "./amplitude";

export function confirmInjection(record: any, patientsList: any, updatePatientsList: any, selectedInjectionTime: any) {
  // we change the status to injected
  patientsList.forEach(function (part: any, index: any, theArray: any) {
    if (theArray[index].index === record.index) {
      theArray[index].isInjected = true;
      record.realInjectionTime = selectedInjectionTime;
    }
  });
  const newFormatedPatients = clean(patientsList);
  updatePatientsList([...newFormatedPatients]);
  sendAmplitudeData(amplitudeLogsTypes.INJECT_PATIENT);
  message.success("Patient injected");

}
