import React from "react"

import './App.css';
import 'antd/dist/antd.css';


import AppHeader from "./Components/AppHeader"
import PatientsTable from "./Components/PatientsTable"


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
} from 'antd';

import { 
  PlusOutlined, 
  ScheduleOutlined, 
  InfoCircleOutlined,
  BankOutlined
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;


const data = [
  {
    key: '1',
    name: 'John Brown',
    dose: 32,
    duration: 30,
    tags: ['done'],
    index: 0,
  },
  {
    key: '2',
    name: 'Jim Green',
    dose: 42,
    duration: 30,
    tags: ['test'],
    index: 1,
  },
  {
    key: '3',
    name: 'Joe Black',
    dose: 32,
    duration: 30,
    tags: ['waiting'],
    index: 2,
  },
  {
    key: '4',
    name: 'Mark Smith',
    dose: 60,
    duration: 45,
    tags: ['waiting'],
    index: 3,
  },
  {
    key: '5',
    name: 'Sami Jr',
    dose: 64,
    duration: 30,
    tags: ['waiting'],
    index: 4,
  },
];


class App extends React.Component {

  constructor(props){
    super(props)
    this.state = { 
      // rp_settings
      rp_activity : 0,
      mesure_time : null,
      first_inj_time : null,
      rp_half_life: 0,
      rp_vol: 0,
      wasted_vol: 0,
      unextractable_vol: 0,
      name: 'MBq optimizer',
  
      // app status
      isDrawerVisible: false,
      isModalVisible: true,
      dataSource: data,
  
      // new patient data (stupid, I know)
      patienName: "",
      patientScanDuration : 0,
      patientDose: 0,
  
    };
    this.onAddPatient = this.onAddPatient.bind(this)
  }



  showDrawer = () => {
    this.setState({
      isDrawerVisible: true,
    });
  };

  onCloseDrawer = () => {
    this.setState({
      isDrawerVisible: false,
    });
  };

  showModal = () => {
    this.setState({isModalVisible : true});
  };

  handleOk = () => {
    this.setState({isModalVisible : false});
  };

  handleCancel = () => {
    this.setState({isModalVisible : false});
  };


  onAddPatient() {
    const {patienName , patientScanDuration , patientDose } = this.state

    const newPatient = {
      name: patienName,
      dose: patientDose,
      duration: patientScanDuration,
      tags: ['waiting'],
      index: this.state.dataSource.length,
      key: (this.state.dataSource.length +1).toString(),
    }
    
    this.setState(state => ({
      dataSource: [...state.dataSource, newPatient],
      patienName: "",
      patientScanDuration : 0,
      patientDose: 0,
      isDrawerVisible: false,
    }));

  }

  renderDrawer() {
    return(
      <Drawer
        title="Create a new account"
        width={720}
        onClose={this.onCloseDrawer}
        visible={this.state.isDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
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
        <Form layout="vertical" >

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter user name' }]}
              >
                <Input 
                  placeholder="Please enter user name" 
                  onChange={(name) => {this.setState({patienName : name.target.value})}}
                />
              </Form.Item>
            </Col>
          </Row>


          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dose"
                label="Dose (MBq)"
                rules={[{ required: true, message: 'Please enter the dose' }]}
              >
                <InputNumber 
                  style={{width : "100%"}} 
                  min={0} 
                  onChange={(dose) => {this.setState({patientDose : dose})}}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="duration"
                label="Scan Duration (min)"
                rules={[{ required: true, message: 'Please enter the duration' }]}
              >
                <InputNumber 
                  style={{width : "100%"}} 
                  min={0} 
                  onChange={(age) => {this.setState({patientScanDuration : age})}}
                  />
              </Form.Item>
            </Col>
          </Row>


        </Form>
      </Drawer>
    )
  }

  renderModal() {

    return(
      <Modal title="Welcome" visible={this.state.isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>

        <Row gutter={16} style={{marginBottom : 10}} >
          <Col className="gutter-row" span={10}>
            <Text type="secondary">RP Half Life (min)</Text>
          </Col>
          <Col className="gutter-row" span={14}>
            <InputNumber
              style={{width : '100%'}}
              defaultValue={0}
              onChange={(rp_half_life) => {this.setState({rp_half_life : rp_half_life})}}
            />
          </Col>
        </Row>

        <Row gutter={16} style={{marginBottom : 10}}>
          <Col className="gutter-row" span={10}>
            <Text type="secondary">RP Activity (MBq)</Text>
          </Col>
          <Col className="gutter-row" span={14}>
            <InputNumber
              style={{width : '100%'}}
              defaultValue={0}
              onChange={(rp_activity) => {this.setState({rp_activity : rp_activity})}}
            />
          </Col>
        </Row>

        <Row gutter={16} style={{marginBottom : 10}}>
          <Col className="gutter-row" span={10}>
            <Text type="secondary">Measure Time</Text>
          </Col>
          <Col className="gutter-row" span={14}>
            <TimePicker style={{width : '100%'}} onChange={(mesure_time) => {this.setState({mesure_time : mesure_time})}} />
          </Col>
        </Row>

        <Row gutter={16} style={{marginBottom : 10}}>
          <Col className="gutter-row" span={10}>
            <Text type="secondary">First Injection Time Time</Text>
          </Col>
          <Col className="gutter-row" span={14}>
            <TimePicker style={{width : '100%'}} onChange={(first_inj_time) => {this.setState({first_inj_time : first_inj_time})}} />
          </Col>
        </Row>

        <Row gutter={16} style={{marginBottom : 10}}>
          <Col className="gutter-row" span={10}>
            <Text type="secondary">RP Volume  (ml)</Text>
          </Col>
          <Col className="gutter-row" span={14}>
            <InputNumber
              style={{width : '100%'}}
              defaultValue={0}
              onChange={(rp_vol) => {this.setState({rp_vol : rp_vol})}}
            />
          </Col>
        </Row>

        <Row gutter={16} style={{marginBottom : 10}}>
          <Col className="gutter-row" span={10}>
            <Text type="secondary">Wasted Volume  (ml)</Text>
          </Col>
          <Col className="gutter-row" span={14}  >
            <InputNumber
              style={{width : '100%'}}
              defaultValue={0}
              onChange={(wasted_vol) => {this.setState({wasted_vol : wasted_vol})}}
            />
          </Col>
        </Row>


        <Row gutter={16} style={{marginBottom : 10}}>
          <Col className="gutter-row" span={10}>
            <Text type="secondary">Unextractable Volume  (ml)</Text>
          </Col>
          <Col className="gutter-row" span={14}>
            <InputNumber
              style={{width : '100%'}}
              defaultValue={0}
              onChange={(unextractable_vol) => {this.setState({unextractable_vol : unextractable_vol})}}
            />
          </Col>
        </Row>

        <Divider orientation="left">Additional Data</Divider>
        <Input 
          placeholder="Lab name" 
          prefix={<BankOutlined />} 
          onChange={(name) => {this.setState({name: name.target.value})}}
        />
      </Modal>
    )
  }


render() {
  return (
    <>
    <Layout style={{minHeight:"100vh"}} > 
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={broken => {
        console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
      }}
    >
        <Title className="logo"  >Scheduler</Title>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<ScheduleOutlined />}>
          Patients
        </Menu.Item>
        <Menu.Item key="2" icon={<InfoCircleOutlined />}>
          Infos
        </Menu.Item>
      </Menu>
    </Sider>
    <Layout>
      <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
      <Content style={{ margin: '24px 16px 0' }}>

        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>

          <AppHeader 
            rp_activity={this.state.rp_activity}
            mesure_time={this.state.mesure_time}
            rp_vol={this.state.rp_vol}
            rp_half_life={this.state.rp_half_life}
            name={this.state.name}
          >
            <Button key="1" >Sort</Button>
            <Button key="2" type="primary" onClick={this.showDrawer}>
              <PlusOutlined /> New Patient
            </Button>
          </AppHeader>


          <PatientsTable 
            dataSource={this.state.dataSource} 
            updateData={(newData) => this.setState({dataSource : newData})} 
          />

        </div>

      </Content>
      <Footer style={{ textAlign: 'center' }}>MBq optimizer 2021 Created by Anis Snoussi</Footer>
    </Layout>
  </Layout>
  {this.renderDrawer()}
  {this.renderModal()}
  </>
  );
}
}

export default App;
