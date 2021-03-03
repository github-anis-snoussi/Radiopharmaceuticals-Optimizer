import React from "react";
import "../App.css";
import 'antd/dist/antd.css';


import { 
  Tag, 
  Row, 
  PageHeader, 
  Statistic, 
  Progress
} from 'antd';


const { Countdown } = Statistic;


const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30; // Moment is also OK

function onFinish() {
  console.log('finished!');
}

const HeaderContent = ({ children, extra }) => (
  <div className="content">
    <div className="main">{children}</div>
    <div className="extra">{extra}</div>
  </div>
);

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



class AppHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <PageHeader
      className="site-page-header-responsive"
      title="MBq optimizer"
      subTitle="3/3/2021"
      tags={<Tag color="blue">Running</Tag>}
      extra={this.props.children}
    >
      <HeaderContent>{renderContent()}</HeaderContent>
    </PageHeader>
    );
  }
}

export default AppHeader;