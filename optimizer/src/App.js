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
  Select, 
  DatePicker,
  Modal,
  InputNumber,
  TimePicker,
  Divider
} from 'antd';

import { 
  PlusOutlined, 
  ScheduleOutlined, 
  InfoCircleOutlined,
  ExperimentOutlined,
  BankOutlined
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;



const data = [
  {
    key: '1',
    name: 'John Brown',
    weight: 32,
    address: 30,
    tags: ['done'],
    index: 0,
  },
  {
    key: '2',
    name: 'Jim Green',
    weight: 42,
    address: 30,
    tags: ['test'],
    index: 1,
  },
  {
    key: '3',
    name: 'Joe Black',
    weight: 32,
    address: 30,
    tags: ['waiting'],
    index: 2,
  },
  {
    key: '4',
    name: 'Mark Smith',
    weight: 60,
    address: 45,
    tags: ['waiting'],
    index: 3,
  },
  {
    key: '5',
    name: 'Sami Jr',
    weight: 64,
    address: 30,
    tags: ['waiting'],
    index: 4,
  },
];


class App extends React.Component {

  state = { 
    isDrawerVisible: false,
    isModalVisible: true,
    dataSource: data,
  };

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
          <Button onClick={this.onCloseDrawer} type="primary">
            Submit
          </Button>
        </div>
      }
    >
      <Form layout="vertical" hideRequiredMark>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter user name' }]}
            >
              <Input placeholder="Please enter user name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="url"
              label="Url"
              rules={[{ required: true, message: 'Please enter url' }]}
            >
              <Input
                style={{ width: '100%' }}
                addonBefore="http://"
                addonAfter=".com"
                placeholder="Please enter url"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="owner"
              label="Owner"
              rules={[{ required: true, message: 'Please select an owner' }]}
            >
              <Select placeholder="Please select an owner">
                <Option value="xiao">Xiaoxiao Fu</Option>
                <Option value="mao">Maomao Zhou</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, message: 'Please choose the type' }]}
            >
              <Select placeholder="Please choose the type">
                <Option value="private">Private</Option>
                <Option value="public">Public</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="approver"
              label="Approver"
              rules={[{ required: true, message: 'Please choose the approver' }]}
            >
              <Select placeholder="Please choose the approver">
                <Option value="jack">Jack Ma</Option>
                <Option value="tom">Tom Liu</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="dateTime"
              label="DateTime"
              rules={[{ required: true, message: 'Please choose the dateTime' }]}
            >
              <DatePicker.RangePicker
                style={{ width: '100%' }}
                getPopupContainer={trigger => trigger.parentElement}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                  message: 'please enter url description',
                },
              ]}
            >
              <Input.TextArea rows={4} placeholder="please enter url description" />
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
              onChange={() => {console.log("e")}}
            />
          </Col>
        </Row>

        <Row gutter={16} style={{marginBottom : 10}}>
          <Col className="gutter-row" span={10}>
            <Text type="secondary">Heure de mesure</Text>
          </Col>
          <Col className="gutter-row" span={6}>
            <TimePicker onChange={() => {console.log('ee')}} />
          </Col>
        </Row>

        <Row gutter={16} style={{marginBottom : 10}}>
          <Col className="gutter-row" span={10}>
            <Text type="secondary">Volume  reçu  (ml)</Text>
          </Col>
          <Col className="gutter-row" span={6}>
            <InputNumber
              defaultValue={0}
              onChange={() => {console.log("e")}}
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
              onChange={() => {console.log("e")}}
            />
          </Col>
        </Row>

        <Divider orientation="left">Additional Data</Divider>
        <Input placeholder="Lab name" prefix={<BankOutlined />} />
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

          <AppHeader>
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
