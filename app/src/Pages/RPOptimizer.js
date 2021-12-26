import React from "react";
import { Button, message, Popconfirm } from "antd";
import {
  UserAddOutlined,
  FileSearchOutlined,
  SettingOutlined,
  UsergroupDeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import AppHeader from "../Components/AppHeader";
import PatientsTable from "../Components/PatientsTable";
import Expectations from "../Components/Expectations";
import WelcomeModal from "../Components/WelcomeModal";
import NewPatientDrawer from "../Components/NewPatientDrawer";
import { sort, now, expect } from "../utils/sort_patient_list";
import {
  setAmplitudeUserId,
  sendAmplitudeData,
  amplitudeLogsTypes,
} from "../utils/amplitude";

const initialState = {
  // rp_settings
  rp_activity: 0,
  mesure_time: null,
  first_inj_time: null,
  rp_half_life: 0,
  rp_vol: 0,
  wasted_vol: 0,
  unextractable_vol: 0,
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
      rp_activity: state.rp_activity,
      mesure_time: new Date(state.mesure_time),
      first_inj_time: new Date(state.first_inj_time),
      rp_half_life: state.rp_half_life,
      rp_vol: state.rp_vol,
      wasted_vol: state.wasted_vol,
      unextractable_vol: state.unextractable_vol,
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
      const now_dict = now(this.state.patientsList, this.getRpSetting());
      this.setState({ now: { ...now_dict } });
    }
  };

  generateExpectations = () => {
    if (this.state.patientsList?.length > 0) {
      const expected = expect(this.state.patientsList, this.getRpSetting());
      let newPatientsList = [...this.state.patientsList].map((x, i) => {
        return {
          ...x,
          expected_injection_time: new Date(
            expected.patient_inj_time_list[i]
          ).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          expected_injection_volume:
            expected.patient_inj_vol_list[i].toFixed(2),
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
        mesure_time: new Date(prevState.mesure_time),
        first_inj_time: new Date(prevState.first_inj_time),
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
          rp_activity={this.state.rp_activity}
          mesure_time={this.state.mesure_time}
          rp_vol={this.state.rp_vol}
          rp_half_life={this.state.rp_half_life}
          name={this.state.name}
          now={this.state.now}
          total={this.state.rp_activity}
        >
          <Button key="1" onClick={this.sortPatients}>
            <FileSearchOutlined /> Sort
          </Button>

          <Button
            key="3"
            onClick={() => this.setState({ isModalVisible: true })}
          >
            <SettingOutlined /> RP Settings
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
            <Button type="primary" danger>
              <UsergroupDeleteOutlined /> Delete All
            </Button>
          </Popconfirm>

          <Button key="2" type="primary" onClick={this.showDrawer}>
            <UserAddOutlined /> New Patient
          </Button>
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
        />
      </>
    );
  }
}

export default RPOptimizer;
