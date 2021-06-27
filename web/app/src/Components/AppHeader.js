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

const renderContent = (measuredActivity, measureTime, receivedVolume, halfLife) => (
  <Row>
  <Statistic
    title="Activité mesurée"
    suffix="MBq"
    value={measuredActivity}

  />
  <Statistic
    title="Heure de mesure"
    value={new Date(measureTime).toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute:'2-digit',
    })}
    style={{
      margin: '0 32px',
    }}
  />
  <Statistic
    title="Volume reçu"
    suffix="ml"
    value={receivedVolume}
  />
  <Statistic
    title="Demi-vie reçue"
    suffix="min"
    value={halfLife}
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
    const {name, children, measuredActivity, measureTime, receivedVolume, halfLife} = this.props
    return (
      <PageHeader
      className="site-page-header-responsive"
      title={name}
      subTitle={new Date().toDateString()}
      tags={<Tag color="blue">Running</Tag>}
      extra={children}
    >
      <HeaderContent>
        {renderContent(measuredActivity, measureTime, receivedVolume, halfLife)}
        </HeaderContent>
    </PageHeader>
    );
  }
}

export default AppHeader;