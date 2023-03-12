import React, { useState } from 'react';

export interface NowStatsType {
  totalVolNow: number | null;
  usableVolNow: number | null;
  totalActivityNow: number | null;
  usableActivityNow: number | null;
}

export interface FutureStatsType {
  totalRemainingActivity: number | null;
  usableRemainingActivity: number | null;
  totalRemainingVol: number | null;
  usableRemainingVol: number | null;
  remainingActivityTime: string | null;
}


export interface StatisticsContextType {
  nowStats: NowStatsType;
  setNowStats: (stats: NowStatsType) => void;
  futureStats: FutureStatsType;
  setFutureStats: (stats: FutureStatsType) => void;
}

const StatisticsContext = React.createContext<StatisticsContextType | null>(null);

const StatisticsContextProvider: React.FC<React.ReactNode> = ({ children }) => {
  // Current stats of the Lab
  const [totalVolNow, setTotalVolNow] = useState<number | null>(null);
  const [usableVolNow, setUsableVolNow] = useState<number | null>(null);
  const [totalActivityNow, setTotalActivityNow] = useState<number | null>(null);
  const [usableActivityNow, setUsableActivityNow] = useState<number | null>(null);

  // Predictions stats of the Lab
  const [totalRemainingActivity, setTotalRemainingActivity] = useState<number | null>(null);
  const [usableRemainingActivity, setUsableRemainingActivity] = useState<number | null>(null);
  const [totalRemainingVol, setTotalRemainingVol] = useState<number | null>(null);
  const [usableRemainingVol, setUsableRemainingVol] = useState<number | null>(null);
  const [remainingActivityTime, setRemainingActivityTime] = useState<string | null>(null);

  const setFutureStats = ({
    totalRemainingActivity,
    usableRemainingActivity,
    totalRemainingVol,
    usableRemainingVol,
    remainingActivityTime,
  }: FutureStatsType) => {
    if (totalRemainingActivity) {
      setTotalRemainingActivity(totalRemainingActivity);
    }
    if (usableRemainingActivity) {
      setUsableRemainingActivity(usableRemainingActivity);
    }
    if (totalRemainingVol) {
      setTotalRemainingVol(totalRemainingVol);
    }
    if (usableRemainingVol) {
      setUsableRemainingVol(usableRemainingVol);
    }
    if (remainingActivityTime) {
      setRemainingActivityTime(remainingActivityTime);
    }
  };

  const setNowStats = ({
    totalVolNow,
    usableVolNow,
    totalActivityNow,
    usableActivityNow,
  }: NowStatsType) => {
    if (totalVolNow) {
      setTotalVolNow(totalVolNow);
    }
    if (usableVolNow) {
      setUsableVolNow(usableVolNow);
    }
    if (totalActivityNow) {
      setTotalActivityNow(totalActivityNow);
    }
    if (usableActivityNow) {
      setUsableActivityNow(usableActivityNow);
    }
  };

  return (
    <StatisticsContext.Provider
      value={{
        nowStats: {
          totalVolNow,
          usableVolNow,
          totalActivityNow,
          usableActivityNow
        },
        setNowStats,
        futureStats: {
          totalRemainingActivity,
          usableRemainingActivity,
          totalRemainingVol,
          usableRemainingVol,
          remainingActivityTime,
        },
        setFutureStats,
      }}
    >
      {children}
    </StatisticsContext.Provider>
  );
};

export { StatisticsContextProvider, StatisticsContext };
