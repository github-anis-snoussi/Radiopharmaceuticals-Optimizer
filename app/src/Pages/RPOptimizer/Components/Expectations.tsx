import { useContext } from 'react';
import { Statistic, Row, Col, Typography } from 'antd';
import { BranchesOutlined, ExperimentOutlined } from '@ant-design/icons';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import { StatisticsContext, StatisticsContextType } from '../../../context/StatisticsContext';
import useMediaQuery from '../../../hooks/useMediaQuery';

const { Title, Text } = Typography;

const Expectations = () => {
  const { currentTheme } = useThemeSwitcher();
  const position = useMediaQuery('(max-width: 767px)', 'center', 'flex-end');
  const {
    futureStats: {
      totalRemainingActivity,
      usableRemainingActivity,
      totalRemainingVol,
      usableRemainingVol,
      remainingActivityTime,
      totalExpectedInjectedPatients
    }
  } = useContext(StatisticsContext) as StatisticsContextType;

  return (
    <div style={{ marginTop: 20 }}>
      <Row>
        <Col xs={0} md={6} />
        <Col xs={24} md={8}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: position,
              flexDirection: 'column',
              marginRight: 20,
              marginBottom: 20,
            }}
          >
            <div>
              <Title level={3}>
                <ExperimentOutlined /> Expectations :
              </Title>
            </div>
            <div
              style={{
                marginTop: -10,
                marginRight: 15,
              }}
            >
              <Text mark>
                (experimental <BranchesOutlined />)
              </Text>
            </div>
          </div>
        </Col>
        <Col xs={12} md={5}>
          <Statistic title="Total Remaining Activity" value={totalRemainingActivity.toFixed(2) || '?'} suffix="MBq" />
          <Statistic title="Usable Remaining Activity" value={usableRemainingActivity.toFixed(2) || '?'} suffix="MBq" />
        </Col>
        <Col xs={12} md={5}>
          <Statistic title="Total Remaining Volume" value={totalRemainingVol.toFixed(2) || '?'} suffix="ml" />
          <Statistic title="Usable Remaining Volume" value={usableRemainingVol.toFixed(2) || '?'} suffix="ml" />
        </Col>
      </Row>

      <Row>
        <Col xs={0} md={14} />
        <Col xs={24} md={10}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 20,
              backgroundColor: currentTheme === 'dark' ? '#0c0c0c' : '#ececec',
              textAlign: 'center',
            }}
          >
            <Statistic
              title={`Expected to finish injecting ${totalExpectedInjectedPatients} patient(s) at :`}
              value={
                remainingActivityTime
                  ? new Date(remainingActivityTime).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '?'
              }
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Expectations;
