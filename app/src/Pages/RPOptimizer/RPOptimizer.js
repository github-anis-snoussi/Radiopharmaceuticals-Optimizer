import React from "react";
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

const initialState = {
  // rpSettings
  rpActivity: 0,
  mesureTime: null,
  firstInjTime: null,
  rpHalfLife: 0,
  rpVol: 0,
  wastedVol: 0,
  unextractableVol: 0,
  name: "Rp Optimizer",

  // app status
  isDrawerVisible: false,
  isModalVisible: true,
  sideMenuKey: 1,

  //patients list
  patientsList: [],

  // new patient input (stupid, I know)
  isModifyingPatient: false,
  modifiedPatientIndex: 0,
  patienName: "",
  patientScanDuration: 0,
  patientDose: 0,
  currentPatientIndex: 0,

  // expectations values
  expected: {},
  now: {},

  // interval for updating the now object
  intervalId: null,

  // the user unique id for amplitude
  uid: uuidv4(),
};

class RPOptimizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = JSON.parse(localStorage.getItem("state"))
      ? JSON.parse(localStorage.getItem("state"))
      : initialState;

    this.formRef = React.createRef();
    this.onAddPatient = this.onAddPatient.bind(this);
    this.sortPatients = this.sortPatients.bind(this);
    this.deletePatient = this.deletePatient.bind(this);
    this.modifyPatient = this.modifyPatient.bind(this);
    this.getRpSetting = this.getRpSetting.bind(this);
    this.generateExpectations = this.generateExpectations.bind(this);
    this.generateNowStats = this.generateNowStats.bind(this);
    this.deletAllPatients = this.deletAllPatients.bind(this);
  }

  componentDidMount() {
    var intervalId = setInterval(this.generateNowStats, 60000);
    this.setState({ intervalId: intervalId });

    // override this.setState to automatically save state after each update
    const orginial = this.setState;
    this.setState = function () {
      let arguments0 = arguments[0];
      let arguments1 = () => {
        localStorage.setItem("state", JSON.stringify({ ...this.state }));
        if (arguments[1]) {
          arguments[1]();
        }
      };
      orginial.bind(this)(arguments0, arguments1);
    };

    // in case this is after refresh
    this.generateNowStats();
    this.generateExpectations();

    // init the amplitude user
    setAmplitudeUserId(this.state.uid);
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  // helper function
  getRpSetting = () => {
    const { state } = this;
    return {
      rpActivity: state.rpActivity,
      mesureTime: new Date(state.mesureTime),
      firstInjTime: new Date(state.firstInjTime),
      rpHalfLife: state.rpHalfLife,
      rpVol: state.rpVol,
      wastedVol: state.wastedVol,
      unextractableVol: state.unextractableVol,
    };
  };

  deletAllPatients = () => {
    this.setState(
      {
        patientsList: [],
        isModifyingPatient: false,
        modifiedPatientIndex: 0,
        patienName: "",
        patientScanDuration: 0,
        patientDose: 0,
        currentPatientIndex: 0,
        expected: {},
        now: {},
      },
      () => sendAmplitudeData(amplitudeLogsTypes.DELETE_ALL_PATIENTS)
    );
  };

  generateNowStats = () => {
    if (this.state.patientsList?.length > 0) {
      const nowDict = now(this.state.patientsList, this.getRpSetting());
      this.setState({ now: { ...nowDict } });
    }
  };

  generateExpectations = () => {
    if (this.state.patientsList?.length > 0) {
      const expected = expect(this.state.patientsList, this.getRpSetting());
      let newPatientsList = [...this.state.patientsList].map((x, i) => {
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
      this.setState(
        { expected: { ...expected }, patientsList: [...newPatientsList] },
        () => {
          this.generateNowStats();
        }
      );
    }
  };

  showDrawer = () => {
    this.setState({
      isDrawerVisible: true,
    });
  };

  closeDrawer = () => {
    this.setState({
      isDrawerVisible: false,
      isModifyingPatient: false,
    });
  };

  showModal = () => {
    this.setState({
      isModalVisible: true,
    });
  };

  closeModal = () => {
    this.setState({
      isModalVisible: false,
    });
  };

  confirmSettings = () => {
    this.setState(
      (prevState) => ({
        mesureTime: new Date(prevState.mesureTime),
        firstInjTime: new Date(prevState.firstInjTime),
        isModalVisible: false,
      }),
      () => {
        message.success("Session initialized.");
        sendAmplitudeData(amplitudeLogsTypes.UPDATED_RP_SETTINGS);
      }
    );
  };

  onAddPatient() {
    const { patienName, patientScanDuration, patientDose, isModifyingPatient } =
      this.state;
    if (isModifyingPatient) {
      const newPatient = {
        name: patienName,
        dose: patientDose,
        duration: patientScanDuration,
        status: "waiting",
        index: this.state.modifiedPatientIndex,
        realInjectionTime: null,
      };

      this.setState(
        (state) => ({
          patientsList: [
            ...state.patientsList.map((p) =>
              p.index === this.state.modifiedPatientIndex
                ? { ...newPatient }
                : p
            ),
          ],
          isDrawerVisible: false,
          currentPatientIndex: state.currentPatientIndex + 1,
          isModifyingPatient: false,
        }),
        () => {
          this.generateExpectations();
          sendAmplitudeData(amplitudeLogsTypes.MODIFY_PATIENT);
        }
      );
    } else {
      const newPatient = {
        name: patienName,
        dose: patientDose,
        duration: patientScanDuration,
        status: "waiting",
        index: this.state.currentPatientIndex,
        realInjectionTime: null,
      };

      this.setState(
        (state) => ({
          patientsList: [...state.patientsList, newPatient],
          isDrawerVisible: false,
          currentPatientIndex: state.currentPatientIndex + 1,
        }),
        () => {
          this.generateExpectations();
          sendAmplitudeData(amplitudeLogsTypes.NEW_PATIENT);
        }
      );
    }
  }

  sortPatients() {
    const newFormatedPatients = sort(
      this.state.patientsList,
      this.getRpSetting()
    );

    this.setState({ patientsList: [...newFormatedPatients] }, () => {
      message.success("Patient List sorted");
      this.generateExpectations();
      sendAmplitudeData(amplitudeLogsTypes.SORT_PATIENTS);
    });
  }

  deletePatient(record) {
    let newPatierntsData = this.state.patientsList.filter(
      (p) => p.index !== record.index
    );
    this.setState({ patientsList: [...newPatierntsData] }, () => {
      this.generateExpectations();
      sendAmplitudeData(amplitudeLogsTypes.DELETE_PATIENT);
    });
  }

  modifyPatient(record) {
    this.setState(
      {
        isModifyingPatient: true,
        modifiedPatientIndex: record.index,
        patienName: record.name,
        patientScanDuration: record.duration,
        patientDose: record.dose,
        isDrawerVisible: true,
      },
      () => {
        this.formRef.current.setFieldsValue({
          name: record.name,
          dose: record.dose,
          duration: record.duration,
        });
      }
    );
  }

  render() {
    return (
      <>
        <AppHeader
          rpActivity={this.state.rpActivity}
          mesureTime={this.state.mesureTime}
          rpVol={this.state.rpVol}
          rpHalfLife={this.state.rpHalfLife}
          name={this.state.name}
          now={this.state.now}
          total={this.state.rpActivity}
        >
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <Button key="1" onClick={this.sortPatients} style={{ margin: 5 }}>
              <FileSearchOutlined /> Sort
            </Button>

            <Button
              key="3"
              onClick={() => this.setState({ isModalVisible: true })}
              style={{ margin: 5 }}
            >
              <SettingOutlined /> Settings
            </Button>

            <Popconfirm
              key="4"
              title={"Delete All ?"}
              icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
              onConfirm={this.deletAllPatients}
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
              onClick={this.showDrawer}
              style={{ margin: 5 }}
            >
              <UserAddOutlined /> New Patient
            </Button>
          </div>
        </AppHeader>

        <PatientsTable
          patientsList={this.state.patientsList}
          updateData={(newData) =>
            this.setState({ patientsList: newData }, () =>
              this.generateExpectations()
            )
          }
          deletePatient={this.deletePatient}
          modifyPatient={this.modifyPatient}
          generateExpectations={this.generateExpectations}
        />

        <Expectations {...this.state.expected} />
        <NewPatientDrawer
          isDrawerVisible={this.state.isDrawerVisible}
          closeDrawer={this.closeDrawer}
          onAddPatient={this.onAddPatient}
          formRef={this.formRef}
          setName={(name) => this.setState({ patienName: name })}
          setDose={(dose) => this.setState({ patientDose: dose })}
          setDuration={(duartion) =>
            this.setState({ patientScanDuration: duartion })
          }
        />
        <WelcomeModal
          isModalVisible={this.state.isModalVisible}
          closeModal={this.closeModal}
          confirmSettings={this.confirmSettings}
          settings={this.getRpSetting()}
          setSettings={(settings) => this.setState({ ...settings })}
        />
      </>
    );
  }
}

export default RPOptimizer;
