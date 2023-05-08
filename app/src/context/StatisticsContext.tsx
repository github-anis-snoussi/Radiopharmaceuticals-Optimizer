import React, { useState, useEffect, useContext } from 'react';
import { PatientsContext, PatientsContextType } from './PatientsContext';
import { RpSettingsContext, RpSettingsContextType } from './RpSettingsContext';
import { predict } from '../core/predict';
import { currentStats } from '../core/now';

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
  futureStats: FutureStatsType;
}

const StatisticsContext = React.createContext<StatisticsContextType | null>(null);

const StatisticsContextProvider: React.FC<React.ReactNode> = ({ children }) => {

  const { patientsList } = useContext(PatientsContext) as PatientsContextType;
  const { rpSettings } = useContext(RpSettingsContext) as RpSettingsContextType;

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

  const updateStats = () => {
    const perdictions = predict(patientsList, rpSettings);
    const currentState = currentStats(patientsList, rpSettings)
    setFutureStats(perdictions);
    setNowStats(currentState);
  }

  useEffect(() => {
    const statisticsInterval = setInterval(() => {
      updateStats()
    }, 60000);
    return () => clearInterval(statisticsInterval);
  }, [updateStats]);

  useEffect(() => {
    updateStats();
  }, [patientsList, rpSettings]);

  useEffect(()=> {
    console.log("FUTURE STAT : ", {
      totalRemainingActivity,
      usableRemainingActivity,
      totalRemainingVol,
      usableRemainingVol,
      remainingActivityTime,
      totalExpectedInjectedPatients,
    })
  }, [
    totalRemainingActivity,
    usableRemainingActivity,
    totalRemainingVol,
    usableRemainingVol,
    remainingActivityTime,
    totalExpectedInjectedPatients,
  ])

  useEffect(()=> {
    console.log("NOW STAT : ", {
      totalVolNow,
      usableVolNow,
      totalActivityNow,
      usableActivityNow,
    })
  }, [
    totalVolNow,
    usableVolNow,
    totalActivityNow,
    usableActivityNow,
  ])


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
        futureStats: {
          totalRemainingActivity,
          usableRemainingActivity,
          totalRemainingVol,
          usableRemainingVol,
          remainingActivityTime,
          totalExpectedInjectedPatients
        },
      }}
    >
      {children}
    </StatisticsContext.Provider>
  );
};

export { StatisticsContextProvider, StatisticsContext };
