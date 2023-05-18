import { useContext, useState, useEffect } from 'react';
import { Row, Statistic, Progress } from 'antd';
import { FunctionOutlined } from '@ant-design/icons';
import { StatisticsContext, StatisticsContextType } from '../../../context/StatisticsContext';

const HeaderStatistics = ({
  rpActivity,
  mesureTime,
  rpVol,
  rpHalfLife,
  total,
}: {
  rpActivity: any;
  mesureTime: any;
  rpVol: any;
  rpHalfLife: any;
  total: any;
}) => {
  const {
    currentStatsCycle,
    nowStats: {  totalActivityNow },
  } = useContext(StatisticsContext) as StatisticsContextType;

  const [statsProgress, setStatsProgress] = useState<number>(0);

  useEffect(() => {
    const statisticsInterval = setInterval(() => {
      setStatsProgress( ((new Date().getTime() - currentStatsCycle) / 5000) * 100 )
    }, 50);
    return () => clearInterval(statisticsInterval);
  }, [currentStatsCycle, setStatsProgress]);

  return (
    <>
      <Row>
        <Progress width={60} style={{
          alignSelf: 'center',
          marginRight: 10
        }} type="dashboard" percent={statsProgress} format={() => <FunctionOutlined />} />
        <Statistic title="RP Activity" suffix="MBq" value={rpActivity} style={{ margin: 10 }} />
        <Statistic
          title="Measure Time"
          value={new Date(mesureTime).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          style={{ margin: 10 }}
        />
        <Statistic title="RP Volume" suffix="ml" value={rpVol} style={{ margin: 10 }} />
        <Statistic title="RP Half Life" suffix="min" value={rpHalfLife} style={{ margin: 10 }} />
      </Row>
      <Row>
        { totalActivityNow ? (
          <Progress
            style={{ paddingRight: 20 }}
            strokeColor={{
              '0%': 'red',
              '100%': 'green',
            }}
            percent={( totalActivityNow / total) * 100}
            format={percent => `${((percent ? percent * total : 0) / 100).toFixed(0)} MBq`}
          />
        ) : null}
      </Row>
    </>
  );
};

export default HeaderStatistics;
