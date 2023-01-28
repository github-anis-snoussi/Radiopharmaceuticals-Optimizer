import React, { useContext } from "react";
import { PageHeader } from "antd";
import HeaderStatistics from "./HeaderStatistics";
import {
  RpSettingsContextContext,
  RpSettingsContextType,
} from "../../../context/RpSettingsContext";

const HeaderContent = ({ children }: { children: any }) => (
  <div className="content">
    <div className="main">{children}</div>
  </div>
);

const AppHeader = ({ children, now }: { children: any; now: any }) => {
  const {
    rpSettings: { labName, rpActivity, rpVol, rpHalfLife, mesureTime },
  } = useContext(RpSettingsContextContext) as RpSettingsContextType;

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
