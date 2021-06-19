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
    weight: 32,
    duration: 30,
    tags: ['done'],
    index: 0,
  },
  {
    key: '2',
    name: 'Jim Green',
    weight: 42,
    duration: 30,
    tags: ['test'],
    index: 1,
  },
  {
    key: '3',
    name: 'Joe Black',
    weight: 32,
    duration: 30,
    tags: ['waiting'],
    index: 2,
  },
  {
    key: '4',
    name: 'Mark Smith',
    weight: 60,
    duration: 45,
    tags: ['waiting'],
    index: 3,
  },
  {
    key: '5',
    name: 'Sami Jr',
    weight: 64,
    duration: 30,
    tags: ['waiting'],
    index: 4,
  },
];


class App extends React.Component {

  constructor(props){
    super(props)
    this.state = { 
      // initial data
      measuredActivity : 0,
      measureTime : null,
      receivedVolume: 0,
      halfLife: 0,
      name: 'MBq optimizer',
  
      // app status
      isDrawerVisible: false,
      isModalVisible: true,
      dataSource: data,
  
      // new patient data (stupid, I know)
      patienName: "",
      patientAge : 0,
      patientWeight: 0
  
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
    const {patienName , patientAge , patientWeight } = this.state

    const newPatient = {
      name: patienName,
      weight: patientWeight,
      duration: patientAge,
      tags: ['waiting'],
      index: this.state.dataSource.length,
      key: (this.state.dataSource.length +1).toString(),
    }
    
    this.setState(state => ({
      dataSource: [...state.dataSource, newPatient],
      patienName: "",
      patientAge : 0,
      patientWeight: 0,
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
              name="weight"
              label="Weight (Kg)"
              rules={[{ required: true, message: 'Please enter the weight' }]}
            >
              <InputNumber 
                style={{width : "100%"}} 
                min={0} 
                onChange={(weight) => {this.setState({patientWeight : weight})}}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="duration"
              label="Test Duration (min)"
              rules={[{ required: true, message: 'Please enter the duration' }]}
            >
              <InputNumber 
                style={{width : "100%"}} 
                min={0} 
                onChange={(age) => {this.setState({patientAge : age})}}
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

        <Row gutter={16} style={{marginBottom : 10}}>
          <Col className="gutter-row" span={10}>
            <Text type="secondary">Activité mesurée (MBq)</Text>
          </Col>
          <Col className="gutter-row" span={6}>
            <InputNumber
              defaultValue={0}
              onChange={(measuredActivity) => {this.setState({measuredActivity : measuredActivity})}}
            />
          </Col>
        </Row>

        <Row gutter={16} style={{marginBottom : 10}}>
          <Col className="gutter-row" span={10}>
            <Text type="secondary">Heure de mesure</Text>
          </Col>
          <Col className="gutter-row" span={6}>
            <TimePicker onChange={(measureTime) => {this.setState({measureTime : measureTime})}} />
          </Col>
        </Row>

        <Row gutter={16} style={{marginBottom : 10}}>
          <Col className="gutter-row" span={10}>
            <Text type="secondary">Volume  reçu  (ml)</Text>
          </Col>
          <Col className="gutter-row" span={6}>
            <InputNumber
              defaultValue={0}
              onChange={(receivedVolume) => {this.setState({receivedVolume : receivedVolume})}}
            />
          </Col>
        </Row>

        <Row gutter={16}>
          <Col className="gutter-row" span={10}>
            <Text type="secondary">Demi-vie reçue (min)</Text>
          </Col>
          <Col className="gutter-row" span={6}>
            <InputNumber
              defaultValue={0}
              onChange={(halfLife) => {this.setState({halfLife : halfLife})}}
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
            measuredActivity={this.state.measuredActivity}
            measureTime={this.state.measureTime}
            receivedVolume={this.state.receivedVolume}
            halfLife={this.state.halfLife}
            name={this.state.name}
          >
            <Button key="1" >Sort</Button>
            <Button key="2" type="primary" onClick={this.showDrawer}>
              <PlusOutlined /> New user
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
