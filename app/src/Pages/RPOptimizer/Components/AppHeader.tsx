import React, { useContext } from "react";
import { PageHeader } from "antd";
import HeaderStatistics from "./HeaderStatistics";
import { Context } from "../../../Context";

const HeaderContent = ({ children }: { children: any }) => (
  <div className="content">
    <div className="main">{children}</div>
  </div>
);

const AppHeader = ({ children, now }: { children: any; now: any }) => {
  const { labName, rpActivity, rpVol, rpHalfLife, mesureTime } =
    useContext(Context);
  return (
    <PageHeader
      className="site-page-header-responsive"
      title={labName}
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
          total={rpActivity}
        />
      </HeaderContent>
    </PageHeader>
  );
};

export default AppHeader;
