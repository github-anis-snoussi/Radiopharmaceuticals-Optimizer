import React from "react"

import './App.css';
import 'antd/dist/antd.css';


import { 
  Layout, 
  Menu, 
  Typography, 
  Table, 
  Tag, 
  Space, 
  Drawer, 
  Form, 
  Button, 
  Col, 
  Row, 
  Input, 
  Select, 
  DatePicker,
  PageHeader, 
  Statistic, 
  Progress
} from 'antd';

import { 
  PlusOutlined, 
  ScheduleOutlined, 
  InfoCircleOutlined,
  MenuOutlined
} from '@ant-design/icons';

import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;
const { Option } = Select;
const { Countdown } = Statistic;


const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30; // Moment is also OK

function onFinish() {
  console.log('finished!');
}


const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
));

const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);


const columns = [
  {
    title: 'Sort',
    dataIndex: 'sort',
    width: 30,
    className: 'drag-visible',
    render: () => <DragHandle />,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: tags => (
      <>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
    index: 0,
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
    index: 1,
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
    index: 2,
  },
];


const renderContent = () => (
    <Row>
    <Statistic
      title="Activité mesurée"
      suffix="MBq"
      value={3825}

    />
    <Statistic
      title="Heure de mesure"
      suffix="AM"
      value={"08:00"}
      style={{
        margin: '0 32px',
      }}
    />
    <Statistic
      title="Volume reçu"
      suffix="ml"
      value={8.5}
    />
    <Statistic
      title="Demi-vie reçue"
      suffix="min"
      value={109.8}
      style={{
        margin: '0 32px',
      }}
    />
    <Countdown valueStyle={{ color: '#1890ff' }} title="Time Remaining" value={deadline} onFinish={onFinish} />
    <Progress 
      strokeColor={{
        '0%': 'red',
        '100%': 'green',
      }}
      percent={80} 
      format={percent => `${percent * 10} MBq`} 
      />
  </Row>
);


const HeaderContent = ({ children, extra }) => (
  <div className="content">
    <div className="main">{children}</div>
    <div className="extra">{extra}</div>
  </div>
);


class App extends React.Component {

  state = { 
    visible: false,
    dataSource: data,
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  renderDrawer() {
    return(
      <Drawer
      title="Create a new account"
      width={720}
      onClose={this.onClose}
      visible={this.state.visible}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={this.onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button onClick={this.onClose} type="primary">
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

  renderHeader() {
    return(
      <PageHeader
      className="site-page-header-responsive"
      title="MBq optimizer"
      subTitle="3/3/2021"
      tags={<Tag color="blue">Running</Tag>}
      extra={[
        <Button key="1">Sort</Button>,
        <Button key="2" type="primary" onClick={this.showDrawer}>
          <PlusOutlined /> New user
        </Button>
      ]}
    >
      <HeaderContent>{renderContent()}</HeaderContent>
    </PageHeader>
    )
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { dataSource } = this.state;
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el);
      console.log('Sorted items: ', newData);
      this.setState({ dataSource: newData });
    }
  };

  DraggableContainer = props => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={this.onSortEnd}
      {...props}
    />
  );

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { dataSource } = this.state;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(x => x.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  renderTable() {
    const { dataSource } = this.state;

    return (
      <Table
        pagination={false}
        dataSource={dataSource}
        columns={columns}
        rowKey="index"
        components={{
          body: {
            wrapper: this.DraggableContainer,
            row: this.DraggableBodyRow,
          },
        }}
      />
    );
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

          {this.renderHeader()}
          {this.renderTable()}

        </div>

      </Content>
      <Footer style={{ textAlign: 'center' }}>MBq optimizer 2021 Created by Anis Snoussi</Footer>
    </Layout>
  </Layout>
  {this.renderDrawer()}
  </>
  );
}
}

export default App;
