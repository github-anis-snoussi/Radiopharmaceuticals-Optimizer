import { useContext, useState, useEffect } from 'react';
import { Progress, Tooltip } from 'antd';
import { FunctionOutlined } from '@ant-design/icons';
import { StatisticsContext, StatisticsContextType } from '../../../context/StatisticsContext';

const StatsProgress = () => {
  const { currentStatsCycle } = useContext(StatisticsContext) as StatisticsContextType;

  const [statsProgress, setStatsProgress] = useState<number>(0);

  useEffect(() => {
    const statisticsInterval = setInterval(() => {
      setStatsProgress( ((new Date().getTime() - currentStatsCycle) / 5000) * 100 )
    }, 50);
    return () => clearInterval(statisticsInterval);
  }, [currentStatsCycle, setStatsProgress]);

  return (
    <Tooltip title="Updating predictions" style={{ margin: 10 }} >
      <Progress width={35}  type="circle" percent={statsProgress} format={() => <FunctionOutlined />} />
    </Tooltip>
  );
};

export default StatsProgress;
