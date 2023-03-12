import { Button, DatePicker, Popconfirm } from "antd";
import { useState } from "react";
import { PatientType } from "../../../context/PatientsContext";


const InjectionTimePicker = ({record, injectPatient}: {record: PatientType, injectPatient: (id: string, injectionTime: string | null) => void}) => {

    const [injectionTime, setInjectionTime] = useState<string | null>(null)

  return ( 
    <Popconfirm
    title={
      <>
        <div>Select Injection Time for {record.name}</div>
        <DatePicker
          showTime
          size="small"
          style={{
            width: '100%',
            marginRight: 10,
            marginTop: 10,
            marginBottom: 10,
          }}
          onChange={(date, dateString) => {
            setInjectionTime(dateString);
          }}
        />
      </>
    }
    onConfirm={() => {
      injectPatient(record.id, injectionTime);
    }}
    okText="Inject"
    cancelText="Cancel"
  >
    <Button size="small"> 💉 Inject {record.name}</Button>
  </Popconfirm>

    );
};

export default InjectionTimePicker;
