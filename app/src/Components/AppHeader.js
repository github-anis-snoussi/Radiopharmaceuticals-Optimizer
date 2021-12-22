import React from "react";
import "../App.css";
import "antd/dist/antd.css";

import { Tag, Row, PageHeader, Statistic } from "antd";



import { Progress } from "antd";
const { Countdown } = Statistic;



const HeaderContent = ({ children, extra }) => (
  <div className="content">
    <div className="main">{children}</div>
    <div className="extra">{extra}</div>
  </div>
);

const renderContent = (rp_activity, mesure_time, rp_vol, rp_half_life, deadline, now, total) => (
  <Row>
    <Statistic title="RP Activity" suffix="MBq" value={rp_activity} />
    <Statistic
      title="Measure Time"
      value={new Date(mesure_time).toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
      })}
      style={{
        margin: "0 32px",
      }}
    />
    <Statistic title="RP Volume" suffix="ml" value={rp_vol} />
    <Statistic
      title="RP Half Life"
      suffix="min"
      value={rp_half_life}
      style={{
        margin: "0 32px",
      }}
    />



    {deadline ? 
      <Countdown
        valueStyle={{ color: "#1890ff" }}
        title="Time Remaining"
        value={deadline}
      />
    : null}

      {now && Object.keys(now).length !== 0 ? 
        <Progress
          style={{paddingRight : 20}}
          strokeColor={{
            "0%": "red",
            "100%": "green",
          }}
          percent={now.total_activity_now/total * 100}
          format={(percent) => `${(percent * total / 100).toFixed(0)} MBq`}
        />
      : null}



    
  </Row>
);

class AppHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { name, children, rp_activity, mesure_time, rp_vol, rp_half_life, deadline, now, total } =
      this.props;

    return (
      <PageHeader
        className="site-page-header-responsive"
        title={name}
        subTitle={new Date().toDateString()}
        tags={<Tag color="blue">Beta Version</Tag>}
        extra={children}
      >
        <HeaderContent>
          {renderContent(rp_activity, mesure_time, rp_vol, rp_half_life, deadline, now, total)}
        </HeaderContent>
      </PageHeader>
    );
  }
}

export default AppHeader;
