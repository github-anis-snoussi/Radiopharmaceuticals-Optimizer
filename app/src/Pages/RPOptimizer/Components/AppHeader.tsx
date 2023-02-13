import { useContext } from 'react';
import { PageHeader } from 'antd';
import HeaderStatistics from './HeaderStatistics';
import { RpSettingsContext, RpSettingsContextType } from '../../../context/RpSettingsContext';

const HeaderContent = ({ children }: { children: any }) => (
  <div className="content">
    <div className="main">{children}</div>
  </div>
);

const AppHeader = ({ children }: { children: any; now?: any }) => {
  const {
    rpSettings: { labName, rpActivity, rpVol, rpHalfLife, mesureTime },
  } = useContext(RpSettingsContext) as RpSettingsContextType;

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
          total={rpActivity}
        />
      </HeaderContent>
    </PageHeader>
  );
};

export default AppHeader;
