import { message } from "antd";
import { clean } from "./sort_patient_list"


export function confirmInjection(record, dataSource, updateData) {
  if (record.realInjectionTime === null) {
    message.warning("Operation aborted");
  } else {
    // we change the status to injected
    dataSource.forEach(function (part, index, theArray) {
      if (theArray[index].index === record.index) {
        theArray[index].status = "done";
      }
    });

    const newFormatedPatients = clean(dataSource)
    updateData([...newFormatedPatients]);
    message.success("Patient injected");
  }
}