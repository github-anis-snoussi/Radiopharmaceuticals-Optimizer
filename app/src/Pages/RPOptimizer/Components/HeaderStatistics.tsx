import { useContext, useEffect } from 'react';
import { Row, Statistic, Progress } from 'antd';
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
    futureStats: { totalRemainingActivity },
  } = useContext(StatisticsContext) as StatisticsContextType;

  return (
    <>
      <Row>
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
        {totalRemainingActivity ? (
          <Progress
            style={{ paddingRight: 20 }}
            strokeColor={{
              '0%': 'red',
              '100%': 'green',
            }}
            percent={(totalRemainingActivity / total) * 100}
            format={percent => `${((percent ? percent * total : 0) / 100).toFixed(0)} MBq`}
          />
        ) : null}
      </Row>
    </>
  );
};

export default HeaderStatistics;
