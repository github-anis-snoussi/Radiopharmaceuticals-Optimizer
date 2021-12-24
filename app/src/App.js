import React from "react";

import "./App.css";
import "antd/dist/antd.css";

import Infos from "./Pages/Infos";


import AppHeader from "./Components/AppHeader";
import PatientsTable from "./Components/PatientsTable";
import Expectations from "./Components/Expectations";

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
  DatePicker,
  Divider,
  message,
  Popconfirm,
} from "antd";

import {
  UserAddOutlined,
  ExperimentOutlined,
  InfoCircleOutlined,
  BankOutlined,
  FileSearchOutlined,
  SettingOutlined,
  UsergroupDeleteOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import moment from 'moment';
import { sort, now, expect} from "./utils/sort_patient_list"


// I simply dont care.
import{ init } from 'emailjs-com';
init(process.env.REACT_APP_EMAILSJS_USER);


const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;



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
  dataSource: [],

  // new patient input (stupid, I know)
  isModifyingPatient: false,
  modifiedPatientIndex: 0,
  patienName: "",
  patientScanDuration: 0,
  patientDose: 0,
  currentPatientIndex: 0,
  
  // expectations values
  expected : {},
  now : {},
  // interval for updating the now object
  intervalId : null
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = JSON.parse(localStorage.getItem('state'))
    ? JSON.parse(localStorage.getItem('state'))
    : initialState
  
    this.formRef = React.createRef();
    this.onAddPatient = this.onAddPatient.bind(this);
    this.sortPatients = this.sortPatients.bind(this);
    this.selectMenuItem = this.selectMenuItem.bind(this);
    this.deletePatient = this.deletePatient.bind(this);
    this.modifyPatient = this.modifyPatient.bind(this);
    this.getRpSetting = this.getRpSetting.bind(this);
    this.generateExpectations = this.generateExpectations.bind(this);
    this.generateNowStats = this.generateNowStats.bind(this);
    this.deletAllPatients = this.deletAllPatients.bind(this);
  }

  componentDidMount() {
    var intervalId = setInterval(this.generateNowStats, 60000);
    this.setState({intervalId: intervalId});

    
    // override this.setState to automatically save state after each update
    const orginial = this.setState;     
    this.setState = function() {
      let arguments0 = arguments[0];
      let arguments1 = () => {localStorage.setItem('state', JSON.stringify({...this.state})); if(arguments[1]){arguments[1]()} };
      orginial.bind(this)(arguments0, arguments1);
    };


    // in case this is after refresh
    this.generateNowStats()
    this.generateExpectations()


  }
  
  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }


  // helper function 
  getRpSetting = () => {
    const {state} = this;
    return {
      rp_activity: state.rp_activity,
      mesure_time: new Date(state.mesure_time),
      first_inj_time: new Date(state.first_inj_time),
      rp_half_life: state.rp_half_life,
      rp_vol: state.rp_vol,
      wasted_vol: state.wasted_vol,
      unextractable_vol: state.unextractable_vol,
    }
  }


  deletAllPatients = () => {
    this.setState({
      dataSource: [],
      isModifyingPatient: false,
      modifiedPatientIndex: 0,
      patienName: "",
      patientScanDuration: 0,
      patientDose: 0,
      currentPatientIndex: 0,
      expected : {},
      now : {},
    })
  }


  generateNowStats = () => {
    if (this.state.dataSource?.length > 0){
      const now_dict = now(this.state.dataSource , this.getRpSetting())
      this.setState({ now : {...now_dict}});
    }
  }

  generateExpectations = () => {
    if (this.state.dataSource?.length > 0){
      const expected = expect(this.state.dataSource, this.getRpSetting())
      let newPatientsList = [...this.state.dataSource].map((x,i) => {
        return {
          ...x,
          expected_injection_time : new Date(expected.patient_inj_time_list[i]).toLocaleTimeString('en-GB', {
            hour: "2-digit",
            minute: "2-digit",
          }),
          expected_injection_volume : expected.patient_inj_vol_list[i].toFixed(2)
        }
      })
      this.setState({expected : {...expected}, dataSource: [...newPatientsList] }, () => {this.generateNowStats()});
    }
  }


  showDrawer = () => {
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
    this.setState((prevState) => ({
      mesure_time: new Date(prevState.mesure_time),
      first_inj_time: new Date(prevState.first_inj_time),
      isModalVisible: false
    }), () => {
      message.success("Session initialized.");
    })

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

      this.setState((state) => ({
        dataSource: [
          ...state.dataSource.map((p) =>
            p.index === this.state.modifiedPatientIndex ? { ...newPatient } : p
          ),
        ],
        isDrawerVisible: false,
        currentPatientIndex: state.currentPatientIndex + 1,
        isModifyingPatient: false,
      }), () => this.generateExpectations());
    } else {
      const newPatient = {
        name: patienName,
        dose: patientDose,
        duration: patientScanDuration,
        status: "waiting",
        index: this.state.currentPatientIndex,
        realInjectionTime: null,
      };

      this.setState((state) => ({
        dataSource: [...state.dataSource, newPatient],
        isDrawerVisible: false,
        currentPatientIndex: state.currentPatientIndex + 1,
      }), () => this.generateExpectations());
    }
  }


  sortPatients() {
    const newFormatedPatients = sort(this.state.dataSource, this.getRpSetting())

    this.setState({ dataSource: [...newFormatedPatients] }, () => {
      message.success("Patient List sorted")
      this.generateExpectations()
    });

  }

  selectMenuItem({ key }) {
    this.setState({ sideMenuKey: parseInt(key, 10) });
  }

  deletePatient(record) {
    let newPatierntsData = this.state.dataSource.filter(
      (p) => p.index !== record.index
    );
    this.setState({ dataSource: [...newPatierntsData] }, () => this.generateExpectations());
  }

  modifyPatient(record) {
    this.setState(
      {
        isModifyingPatient: true,
        modifiedPatientIndex: record.index,
        patienName: record.name,
        patientScanDuration: record.duration,
        patientDose: record.dose,
        isDrawerVisible: true
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


  renderDrawer() {
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
        onCancel={() => this.setState({isModalVisible : false})}
        footer={[
          <Button
            key={1}
            type="primary"
            onClick={this.handleOk}
            disabled={!this.state.mesure_time || !this.state.first_inj_time}
          >
            Confirm
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
              value={this.state.rp_half_life}
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
              value={this.state.rp_activity}
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
            <DatePicker 
              showTime
              style={{ width: "100%" }}
              value={this.state.mesure_time ? moment(this.state.mesure_time) : null}
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
            <DatePicker 
              showTime
              style={{ width: "100%" }}
              value={this.state.first_inj_time ? moment(this.state.first_inj_time) : null}
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
              value={this.state.rp_vol}
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
              value={this.state.wasted_vol}
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
              value={this.state.unextractable_vol}
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
          value={this.state.name}
          onChange={(name) => {
            this.setState({ name: name.target.value });
          }}
        />
      </Modal>
    );
  }


  render() {
    return (
      <>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
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
              <Menu.Item key="1" icon={<ExperimentOutlined />}>
                RP Optimizer
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
                      now={this.state.now}
                      total={this.state.rp_activity}
                    >

                      <Button key="1" onClick={this.sortPatients}>
                      <FileSearchOutlined /> Sort
                      </Button>

                      <Button key="3"  onClick={() => this.setState({isModalVisible : true})}>
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
                        <Button  type="primary" danger>
                          <UsergroupDeleteOutlined /> Delete All
                        </Button>
                      </Popconfirm>


                      <Button key="2" type="primary" onClick={this.showDrawer}>
                        <UserAddOutlined /> New Patient
                      </Button>

                    </AppHeader>

                    <PatientsTable
                      dataSource={this.state.dataSource}
                      updateData={(newData) =>
                        this.setState({ dataSource: newData }, () => this.generateExpectations())
                      }
                      deletePatient={this.deletePatient}
                      modifyPatient={this.modifyPatient}
                      generateExpectations={this.generateExpectations}
                    />

                    <Expectations {...this.state.expected} />

                  </>
                ) : null}

                {this.state.sideMenuKey === 2 ? <Infos /> : null}
              </div>
            </Content>

            <Footer style={{ textAlign: "center" }}>
              RP optimizer {new Date().getFullYear()} Created by Anis Snoussi & Walid Snoussi < br/>
              Version Ref : {process.env.REACT_APP_VERCEL_GIT_COMMIT_SHA ? process.env.REACT_APP_VERCEL_GIT_COMMIT_SHA.substring(0, 8) : 'no-ref'}
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
