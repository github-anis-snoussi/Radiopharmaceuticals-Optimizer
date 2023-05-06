import React, { useState } from 'react';

export interface NowStatsType {
  totalVolNow: number;
  usableVolNow: number;
  totalActivityNow: number;
  usableActivityNow: number;
}

export interface FutureStatsType {
  totalRemainingActivity: number;
  usableRemainingActivity: number;
  totalRemainingVol: number;
  usableRemainingVol: number;
  remainingActivityTime: Date;
  totalExpectedInjectedPatients: number
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
  const [totalVolNow, setTotalVolNow] = useState<number>(0);
  const [usableVolNow, setUsableVolNow] = useState<number>(0);
  const [totalActivityNow, setTotalActivityNow] = useState<number>(0);
  const [usableActivityNow, setUsableActivityNow] = useState<number>(0);

  // Predictions stats of the Lab
  const [totalRemainingActivity, setTotalRemainingActivity] = useState<number>(0);
  const [usableRemainingActivity, setUsableRemainingActivity] = useState<number>(0);
  const [totalRemainingVol, setTotalRemainingVol] = useState<number>(0);
  const [usableRemainingVol, setUsableRemainingVol] = useState<number>(0);
  const [remainingActivityTime, setRemainingActivityTime] = useState<Date>(new Date());
  const [totalExpectedInjectedPatients, setTotalExpectedInjectedPatients] = useState<number>(0);

  const setFutureStats = ({
    totalRemainingActivity,
    usableRemainingActivity,
    totalRemainingVol,
    usableRemainingVol,
    remainingActivityTime,
    totalExpectedInjectedPatients,
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
    if (totalExpectedInjectedPatients) {
      setTotalExpectedInjectedPatients(totalExpectedInjectedPatients);
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
          totalExpectedInjectedPatients
        },
        setFutureStats,
      }}
    >
      {children}
    </StatisticsContext.Provider>
  );
};

export { StatisticsContextProvider, StatisticsContext };
