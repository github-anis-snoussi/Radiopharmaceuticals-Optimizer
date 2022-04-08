import React from "react";
import { PageHeader } from "antd";
import HeaderStatistics from "./HeaderStatistics";

const HeaderContent = ({ children }) => (
  <div className="content">
    <div className="main">{children}</div>
  </div>
);

const AppHeader = ({
  name,
  children,
  rpActivity,
  mesureTime,
  rpVol,
  rpHalfLife,
  now,
  total,
}) => {
  return (
    <PageHeader
      className="site-page-header-responsive"
      title={name}
      subTitle={new Date().toDateString()}
      extra={children}
    >
      <HeaderContent>
        <HeaderStatistics
          rpActivity={rpActivity}
          mesureTime={mesureTime}
          rpVol={rpVol}
          rpHalfLife={rpHalfLife}
          now={now}
          total={total}
        />
      </HeaderContent>
    </PageHeader>
  );
};

export default AppHeader;
