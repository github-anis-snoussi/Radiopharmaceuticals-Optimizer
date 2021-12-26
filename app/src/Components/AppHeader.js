import React from "react";
import { Tag, PageHeader } from "antd";
import HeaderStatistics from "./HeaderStatistics";

const HeaderContent = ({ children, extra }) => (
  <div className="content">
    <div className="main">{children}</div>
    <div className="extra">{extra}</div>
  </div>
);

const AppHeader = ({
  name,
  children,
  rp_activity,
  mesure_time,
  rp_vol,
  rp_half_life,
  now,
  total,
}) => {
  return (
    <PageHeader
      className="site-page-header-responsive"
      title={name}
      subTitle={new Date().toDateString()}
      tags={<Tag color="blue">Beta Version</Tag>}
      extra={children}
    >
      <HeaderContent>
        <HeaderStatistics
          rp_activity={rp_activity}
          mesure_time={mesure_time}
          rp_vol={rp_vol}
          rp_half_life={rp_half_life}
          now={now}
          total={total}
        />
      </HeaderContent>
    </PageHeader>
  );
};

export default AppHeader;
