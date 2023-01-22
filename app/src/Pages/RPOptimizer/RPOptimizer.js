import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { sort, now, expect } from "../../utils/sortPatientList";
import {
  setAmplitudeUserId,
  sendAmplitudeData,
  amplitudeLogsTypes,
} from "../../utils/amplitude";
import { Button, message, Popconfirm } from "antd";
import {
  AppHeader,
  PatientsTable,
  Expectations,
  WelcomeModal,
  NewPatientDrawer,
} from "./Components";
import {
  UserAddOutlined,
  FileSearchOutlined,
  SettingOutlined,
  UsergroupDeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { duration } from "moment";

const RPOptimizer = () => {
  // rpSettings
  const [rpActivity, setRpActivity] = useState(0);
  const [mesureTime, setMesureTime] = useState(null);
  const [firstInjTime, setFirstInjTime] = useState(null);
  const [rpHalfLife, setRpHalfLife] = useState(0);
  const [rpVol, setRpVol] = useState(0);
  const [wastedVol, setWastedVol] = useState(0);
  const [unextractableVol, setUnextractableVol] = useState(0);
  const [name, setName] = useState("Rp Optimizer");

  // app status
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [sideMenuKey, setSideMenuKey] = useState(1);

  //patients list
  const [patientsList, setPatientsList] = useState([]);

  // new patient input (stupid, I know)
  const [isModifyingPatient, setIsModifyingPatient] = useState(false);
  const [modifiedPatientIndex, setModifiedPatientIndex] = useState(0);
  const [patienName, setPatienName] = useState("");
  const [patientScanDuration, setPatientScanDuration] = useState(0);
  const [patientDose, setPatientDose] = useState(0);
  const [currentPatientIndex, setCurrentPatientIndex] = useState(0);

  // expectations values
  const [expected, setExpected] = useState({});
  const [now, setNow] = useState({});

  const newPatientForm = useRef(null);

  useEffect(() => {
    const statsInterval = setInterval(generateNowStats, 60000);

    // in case this is after refresh
    generateNowStats();
    generateExpectations();

    // init the amplitude user
    setAmplitudeUserId(uuidv4());

    return () => {
      clearInterval(statsInterval);
    };
  }, []);

  // helper function
  const getRpSetting = () => {
    return {
      rpActivity,
      mesureTime: new Date(mesureTime),
      firstInjTime: new Date(firstInjTime),
      rpHalfLife,
      rpVol,
      wastedVol,
      unextractableVol,
    };
  };

  const deletAllPatients = () => {
    setPatientsList([]);
    setIsModifyingPatient(false);
    setModifiedPatientIndex(0);
    setModifiedPatientIndex(0);
    setPatienName("");
    setPatientScanDuration(0);
    setPatientDose(0);
    setCurrentPatientIndex(0);
    setExpected({});
    setNow({});

    sendAmplitudeData(amplitudeLogsTypes.DELETE_ALL_PATIENTS);
  };

  const generateNowStats = () => {
    if (patientsList?.length > 0) {
      const nowDict = now(patientsList, getRpSetting());
      setNow({ ...nowDict });
    }
  };

  const generateExpectations = () => {
    if (patientsList?.length > 0) {
      const expected = expect(patientsList, getRpSetting());
      let newPatientsList = [...patientsList].map((x, i) => {
        return {
          ...x,
          expectedInjectionTime: new Date(
            expected.patientInjTimeList[i]
          ).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          expectedInjectionVolume: expected.patientInjVolList[i].toFixed(2),
        };
      });
      setPatientsList([...newPatientsList]);
      setExpected({ ...expected });
      generateNowStats();
    }
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
    setIsModifyingPatient(false);
  };

  const confirmSettings = () => {
    setMesureTime(new Date(mesureTime));
    setFirstInjTime(new Date(firstInjTime));
    setIsModalVisible(false);

    message.success("Session initialized.");
    sendAmplitudeData(amplitudeLogsTypes.UPDATED_RP_SETTINGS);
  };

  const sortPatients = () => {
    const newFormatedPatients = sort(patientsList, getRpSetting());

    setPatientsList([...newFormatedPatients]);
    message.success("Patient List sorted");
    generateExpectations();
    sendAmplitudeData(amplitudeLogsTypes.SORT_PATIENTS);
  };

  const deletePatient = (record) => {
    let newPatierntsData = patientsList.filter((p) => p.index !== record.index);

    setPatientsList([...newPatierntsData]);
    generateExpectations();
    sendAmplitudeData(amplitudeLogsTypes.DELETE_PATIENT);
  };

  const modifyPatient = (record) => {
    setIsModifyingPatient(true);
    setModifiedPatientIndex(record.index);
    setPatienName(record.name);
    setPatientScanDuration(record.duartion);
    setPatientDose(record.dose);
    setIsDrawerVisible(true);

    newPatientForm.current.setFieldsValue({
      name: record.name,
      dose: record.dose,
      duration: record.duration,
    });
  };

  const onAddPatient = ({ name, dose, duration }) => {
    if (isModifyingPatient) {
      const newPatient = {
        id: uuidv4(),
        name: name,
        dose: dose,
        duration: duration,
        isInjected: false,
        realInjectionTime: null,
        index: patientsList.length,
      };
      setPatientsList(
        patientsList.map((p) =>
          p.index === modifiedPatientIndex ? { ...newPatient } : p
        )
      );
      setIsDrawerVisible(false);
      setCurrentPatientIndex(currentPatientIndex + 1);
      setIsModifyingPatient(false);
      generateExpectations();
      sendAmplitudeData(amplitudeLogsTypes.MODIFY_PATIENT);
    } else {
      const newPatient = {
        name,
        dose,
        duration,
        isInjected: false,
        index: currentPatientIndex,
        realInjectionTime: null,
      };
      setPatientsList([...patientsList, newPatient]);
      setIsDrawerVisible(false);
      setCurrentPatientIndex(currentPatientIndex + 1);
      generateExpectations();
      sendAmplitudeData(amplitudeLogsTypes.NEW_PATIENT);
    }
  };

  return (
    <>
      <AppHeader
        rpActivity={rpActivity}
        mesureTime={mesureTime}
        rpVol={rpVol}
        rpHalfLife={rpHalfLife}
        name={name}
        now={now}
        total={rpActivity}
      >
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <Button key="1" onClick={sortPatients} style={{ margin: 5 }}>
            <FileSearchOutlined /> Sort
          </Button>

          <Button
            key="3"
            onClick={() => setIsModalVisible(true)}
            style={{ margin: 5 }}
          >
            <SettingOutlined /> Settings
          </Button>

          <Popconfirm
            key="4"
            title={"Delete All ?"}
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
            onConfirm={deletAllPatients}
            okText="Delete All Patients"
            okButtonProps={{
              danger: true,
            }}
            cancelText="Cancel"
          >
            <Button type="primary" danger style={{ margin: 5 }}>
              <UsergroupDeleteOutlined /> Delete All
            </Button>
          </Popconfirm>

          <Button
            key="2"
            type="primary"
            onClick={() => {
              setIsDrawerVisible(true);
            }}
            style={{ margin: 5 }}
          >
            <UserAddOutlined /> New Patient
          </Button>
        </div>
      </AppHeader>

      <PatientsTable
        patientsList={patientsList}
        updateData={(newData) => {
          setPatientsList(newData);
          generateExpectations();
        }}
        deletePatient={deletePatient}
        modifyPatient={modifyPatient}
        generateExpectations={generateExpectations}
      />

      <Expectations {...expected} />
      <NewPatientDrawer
        isDrawerVisible={isDrawerVisible}
        closeDrawer={closeDrawer}
        onAddPatient={onAddPatient}
        formRef={newPatientForm}
      />
      <WelcomeModal
        isModalVisible={isModalVisible}
        closeModal={() => {
          setIsModalVisible(false);
        }}
        confirmSettings={confirmSettings}
        settings={getRpSetting()}
        setSettings={(settings) => {
          return;
        }}
      />
    </>
  );
};

export default RPOptimizer;
