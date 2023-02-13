import React, { useState } from 'react';

export interface NowStatsType {
  totalRemainingActivity: number | null;
  usableRemainingActivity: number | null;
  totalRemainingVol: number | null;
  usableRemainingVol: number | null;
  remainingActivityTime: string | null;
}

export interface NowStatsTypeContextType {
  nowStats: NowStatsType;
  setNowStats: (stats: NowStatsType) => void;
}

const NowStatsContext = React.createContext<NowStatsTypeContextType | null>(null);

const NowStatsContextProvider: React.FC<React.ReactNode> = ({ children }) => {
  // Current stats of the Lab
  const [totalRemainingActivity, setTotalRemainingActivity] = useState<number | null>(null);
  const [usableRemainingActivity, setUsableRemainingActivity] = useState<number | null>(null);
  const [totalRemainingVol, setTotalRemainingVol] = useState<number | null>(null);
  const [usableRemainingVol, setUsableRemainingVol] = useState<number | null>(null);
  const [remainingActivityTime, setRemainingActivityTime] = useState<string | null>(null);

  const setNowStats = ({
    totalRemainingActivity,
    usableRemainingActivity,
    totalRemainingVol,
    usableRemainingVol,
    remainingActivityTime,
  }: NowStatsType) => {
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

  return (
    <NowStatsContext.Provider
      value={{
        nowStats: {
          totalRemainingActivity,
          usableRemainingActivity,
          totalRemainingVol,
          usableRemainingVol,
          remainingActivityTime,
        },
        setNowStats,
      }}
    >
      {children}
    </NowStatsContext.Provider>
  );
};

export { NowStatsContextProvider, NowStatsContext };
