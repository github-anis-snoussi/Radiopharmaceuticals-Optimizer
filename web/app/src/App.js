import React from "react";

import "./App.css";
import "antd/dist/antd.css";

import AppHeader from "./Components/AppHeader";
import PatientsTable from "./Components/PatientsTable";
import Infos from "./Components/Infos";

import {
  Layout,
  Menu,
  Typography,
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Modal,
  InputNumber,
  TimePicker,
  Divider,
  message,
} from "antd";

import {
  UserAddOutlined,
  ScheduleOutlined,
  InfoCircleOutlined,
  BankOutlined,
} from "@ant-design/icons";

import axios from "./utils/axios";
import { formatFront2Back, formatBack2Front } from "./utils/utils";

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

const dummyData = [
  {
    key: "1", // for some ******* reason I have to do this, otherwise the sortable table acts up !!!
    index: 0,
    name: "John Brown",
    dose: 183,
    duration: 45,
    realInjectionTime: null,
    status: "waiting",
  },
  {
    key: "2",
    index: 1,
    name: "Jim Green",
    dose: 120,
    duration: 30,
    realInjectionTime: null,
    status: "waiting",
  },
  {
    key: "3",
    index: 2,
    name: "Joe Black",
    dose: 200,
    duration: 30,
    realInjectionTime: null,
    status: "waiting",
  },
  {
    key: "4",
    index: 3,
    name: "Mark Smith",
    dose: 300,
    duration: 30,
    realInjectionTime: null,
    status: "waiting",
  },
  {
    key: "5",
    index: 4,
    name: "Sami Jr",
    dose: 150,
    duration: 30,
    realInjectionTime: null,
    status: "waiting",
  },
  {
    key: "6",
    index: 5,
    name: "Sami Jr 2",
    dose: 300,
    duration: 30,
    realInjectionTime: null,
    status: "waiting",
  },
  {
    key: "7",
    index: 6,
    name: "Sami Jr 3",
    dose: 300,
    duration: 40,
    realInjectionTime: null,
    status: "waiting",
  },
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      // dataSource: dummyData, // DEV
      dataSource: [], // PROD

      // new patient input (stupid, I know)
      isModifyingPatient: false,
      modifiedPatientIndex: 0,
      patienName: "",
      patientScanDuration: 0,
      patientDose: 0,
      currentPatientIndex: 0, // PROD
      // currentPatientIndex: dummyData.length, // DEV
    };
    this.onAddPatient = this.onAddPatient.bind(this);
    this.sortPatients = this.sortPatients.bind(this);
    this.selectMenuItem = this.selectMenuItem.bind(this);
    this.deletePatient = this.deletePatient.bind(this);
    this.modifyPatient = this.modifyPatient.bind(this);
  }

  formRef = React.createRef();

  showDrawer = () => {
    console.log(this.state);
    this.setState({
      isDrawerVisible: true,
    });
  };

  onCloseDrawer = () => {
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

  handleOk = () => {
    const { state } = this;

    const formatedRpSettings = {
      rp_activity: state.rp_activity,
      mesure_time: state.mesure_time.valueOf(),
      first_inj_time: state.first_inj_time.valueOf(),
      rp_half_life: state.rp_half_life,
      rp_vol: state.rp_vol,
      wasted_vol: state.wasted_vol,
      unextractable_vol: state.unextractable_vol,
    };

    axios
      .post("session", formatedRpSettings)
      .then((res) => {
        // res = res.data;
        // console.log(res);
        this.setState({ isModalVisible: false });
        message.success("Session initialized.");
      })
      .catch((e) => {
        // console.log(e);
        message.error("Something went wrong.");
      });
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
        key: (this.state.modifiedPatientIndex + 1).toString(),
        realInjectionTime: null,
      };

      this.setState((state) => ({
        dataSource: [
          ...state.dataSource.map((p) =>
            p.index === this.state.modifiedPatientIndex ? { ...newPatient } : p
          ),
        ],
        isDrawerVisible: false,
        currentPatientIndex: state.currentPatientIndex + 1,
        isModifyingPatient: false,
      }));
    } else {
      const newPatient = {
        name: patienName,
        dose: patientDose,
        duration: patientScanDuration,
        status: "waiting",
        index: this.state.currentPatientIndex,
        key: (this.state.currentPatientIndex + 1).toString(),
        realInjectionTime: null,
      };

      this.setState((state) => ({
        dataSource: [...state.dataSource, newPatient],
        isDrawerVisible: false,
        currentPatientIndex: state.currentPatientIndex + 1,
      }));
    }
  }

  renderDrawer() {
    let { patienName, patientDose, patientScanDuration } = this.state;
    console.log(patienName);
    return (
      <Drawer
        title="Create a new account"
        width={720}
        onClose={this.onCloseDrawer}
        visible={this.state.isDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: "right",
            }}
          >
            <Button onClick={this.onCloseDrawer} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button onClick={this.onAddPatient} type="primary">
              Submit
            </Button>
          </div>
        }
      >
        <Form layout="vertical" ref={this.formRef}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: "Please enter user name" }]}
              >
                <Input
                  placeholder="Please enter user name"
                  onChange={(name) => {
                    this.setState({ patienName: name.target.value });
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dose"
                label="Dose (MBq)"
                rules={[{ required: true, message: "Please enter the dose" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  onChange={(dose) => {
                    this.setState({ patientDose: dose });
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="duration"
                label="Scan Duration (min)"
                rules={[
                  { required: true, message: "Please enter the duration" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  onChange={(age) => {
                    this.setState({ patientScanDuration: age });
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    );
  }

  renderModal() {
    return (
      <Modal
        title="Welcome"
        visible={this.state.isModalVisible}
        footer={[
          <Button
            key={1}
            type="primary"
            onClick={this.handleOk}
            disabled={!this.state.mesure_time || !this.state.first_inj_time}
          >
            Start
          </Button>,
        ]}
      >
        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col className="gutter-row" span={10}>
            <Text type="secondary">RP Half Life (min)</Text>
          </Col>
          <Col className="gutter-row" span={14}>
            <InputNumber
              style={{ width: "100%" }}
              defaultValue={0}
              onChange={(rp_half_life) => {
                this.setState({ rp_half_life: rp_half_life });
              }}
            />
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col className="gutter-row" span={10}>
            <Text type="secondary">RP Activity (MBq)</Text>
          </Col>
          <Col className="gutter-row" span={14}>
            <InputNumber
              style={{ width: "100%" }}
              defaultValue={0}
              onChange={(rp_activity) => {
                this.setState({ rp_activity: rp_activity });
              }}
            />
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col className="gutter-row" span={10}>
            <Text type="secondary">Measure Time</Text>
          </Col>
          <Col className="gutter-row" span={14}>
            <TimePicker
              style={{ width: "100%" }}
              onChange={(mesure_time) => {
                this.setState({ mesure_time: mesure_time });
              }}
            />
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col className="gutter-row" span={10}>
            <Text type="secondary">First Injection Time</Text>
          </Col>
          <Col className="gutter-row" span={14}>
            <TimePicker
              style={{ width: "100%" }}
              onChange={(first_inj_time) => {
                this.setState({ first_inj_time: first_inj_time });
              }}
            />
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col className="gutter-row" span={10}>
            <Text type="secondary">RP Volume (ml)</Text>
          </Col>
          <Col className="gutter-row" span={14}>
            <InputNumber
              style={{ width: "100%" }}
              defaultValue={0}
              onChange={(rp_vol) => {
                this.setState({ rp_vol: rp_vol });
              }}
            />
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col className="gutter-row" span={10}>
            <Text type="secondary">Wasted Volume (ml)</Text>
          </Col>
          <Col className="gutter-row" span={14}>
            <InputNumber
              style={{ width: "100%" }}
              defaultValue={0}
              onChange={(wasted_vol) => {
                this.setState({ wasted_vol: wasted_vol });
              }}
            />
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col className="gutter-row" span={10}>
            <Text type="secondary">Unextractable Volume (ml)</Text>
          </Col>
          <Col className="gutter-row" span={14}>
            <InputNumber
              style={{ width: "100%" }}
              defaultValue={0}
              onChange={(unextractable_vol) => {
                this.setState({ unextractable_vol: unextractable_vol });
              }}
            />
          </Col>
        </Row>

        <Divider orientation="left">Additional Data</Divider>
        <Input
          placeholder="Lab name"
          prefix={<BankOutlined />}
          onChange={(name) => {
            this.setState({ name: name.target.value });
          }}
        />
      </Modal>
    );
  }

  sortPatients() {
    console.log("patients list before send to sort : ", this.state.dataSource);
    const formatedPatientInfos = formatFront2Back(this.state.dataSource);

    axios
      .post("sort", { patient_list: formatedPatientInfos })
      .then((res) => {
        let sorted_list = res.data.sorted_list;
        console.log(sorted_list);
        const newFormatedPatients = formatBack2Front(sorted_list);

        this.setState({ dataSource: [...newFormatedPatients] });
        console.log("patients list after send to sort : ", newFormatedPatients);
        message.success("Patient List sorted");
      })
      .catch((e) => {
        console.log(e);
        message.error("Something went wrong.");
      });
  }

  selectMenuItem({ key }) {
    this.setState({ sideMenuKey: parseInt(key, 10) });
  }

  deletePatient(record) {
    let newPatierntsData = this.state.dataSource.filter(
      (p) => p.index !== record.index
    );
    this.setState({ dataSource: [...newPatierntsData] });
  }

  modifyPatient(record) {
    this.setState(
      {
        isModifyingPatient: true,
        modifiedPatientIndex: record.index,
        patienName: record.name,
        patientScanDuration: record.duration,
        patientDose: record.dose,
      },
      () => this.showDrawer()
    );

    this.formRef.current.setFieldsValue({
      name: record.name,
      dose: record.dose,
      duration: record.duration,
    });
  }

  render() {
    return (
      <>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                margin: 10,
              }}
            >
              <img
                src={"logo-filled-white.png"}
                style={{ height: 60, aspectRatio: 1 }}
                alt="app-logo"
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  padding: 0,
                  margin: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "white",
                    textAlign: "center",
                    padding: 0,
                    margin: 0,
                    height: 20,
                  }}
                >
                  RP
                </span>
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "white",
                    textAlign: "center",
                    padding: 0,
                    margin: 0,
                    height: 20,
                    marginBottom: 15,
                  }}
                >
                  Optimizer
                </span>
              </div>
            </div>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={["1"]}
              onSelect={this.selectMenuItem}
            >
              <Menu.Item key="1" icon={<ScheduleOutlined />}>
                Patients List
              </Menu.Item>
              <Menu.Item key="2" icon={<InfoCircleOutlined />}>
                Infos
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header
              className="site-layout-sub-header-background"
              style={{ padding: 0 }}
            />

            <Content style={{ margin: "24px 16px 0" }}>
              <div
                className="site-layout-background"
                style={{ padding: 24, minHeight: 360 }}
              >
                {this.state.sideMenuKey === 1 ? (
                  <>
                    <AppHeader
                      rp_activity={this.state.rp_activity}
                      mesure_time={this.state.mesure_time}
                      rp_vol={this.state.rp_vol}
                      rp_half_life={this.state.rp_half_life}
                      name={this.state.name}
                    >
                      <Button key="1" onClick={this.sortPatients}>
                        Sort
                      </Button>
                      <Button key="2" type="primary" onClick={this.showDrawer}>
                        <UserAddOutlined /> New Patient
                      </Button>
                    </AppHeader>

                    <PatientsTable
                      dataSource={this.state.dataSource}
                      updateData={(newData) =>
                        this.setState({ dataSource: newData })
                      }
                      deletePatient={this.deletePatient}
                      modifyPatient={this.modifyPatient}
                    />
                  </>
                ) : null}

                {this.state.sideMenuKey === 2 ? <Infos /> : null}
              </div>
            </Content>

            <Footer style={{ textAlign: "center" }}>
              RP optimizer 2021 Created by Anis Snoussi & Walid Snoussi
            </Footer>
          </Layout>
        </Layout>
        {this.renderDrawer()}
        {this.renderModal()}
      </>
    );
  }
}

export default App;
