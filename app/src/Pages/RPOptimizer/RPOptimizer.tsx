import { useContext, useEffect, useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { AppHeader, PatientsTable, Expectations, WelcomeModal, NewPatientDrawer } from './Components';
import {
  UserAddOutlined,
  FileSearchOutlined,
  SettingOutlined,
  UsergroupDeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { PatientsContext, PatientsContextType } from '../../context/PatientsContext';
import { RpSettingsContext, RpSettingsContextType } from '../../context/RpSettingsContext';
import { StatisticsContext, StatisticsContextType } from '../../context/StatisticsContext';
import { sort } from '../../core/sort';
import { predict } from '../../core/predict';
import { currentStats } from '../../core/now';


const RPOptimizer = () => {
  const [modifiedPatientId, setModifiedPatientId] = useState<string | undefined>(undefined);
  const { patientsList, updatePatientsList } = useContext(PatientsContext) as PatientsContextType;
  const { rpSettings } = useContext(RpSettingsContext) as RpSettingsContextType;
  const { setFutureStats, setNowStats } = useContext(StatisticsContext) as StatisticsContextType;

  // app status
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);

  const updateStats = () => {
    const perdictions = predict(patientsList, rpSettings);
    const currentState = currentStats(patientsList, rpSettings)
    setFutureStats(perdictions);
    setNowStats(currentState);
  }

  // Listens for changes and update the prediction / current state
  useEffect(() => {
    const statisticsInterval = setInterval(() => {
      updateStats()
    }, 60000);
    return () => clearInterval(statisticsInterval);
  }, [patientsList, rpSettings]);


  const sortPatients = () => {
    updatePatientsList(sort(patientsList, rpSettings));
  };

  const deletAllPatients = () => {
    updatePatientsList([]);
  };

  const generateExpectations = () => {
    updateStats();
  };
  
  const modifyPatient = (id: string) => {
    setModifiedPatientId(id);
    setIsDrawerVisible(true);
  };

  return (
    <>
      <AppHeader>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Button key="1" onClick={sortPatients} style={{ margin: 5 }}>
            <FileSearchOutlined /> Sort
          </Button>

          <Button key="3" onClick={() => setIsModalVisible(true)} style={{ margin: 5 }}>
            <SettingOutlined /> Settings
          </Button>

          <Popconfirm
            key="4"
            title={'Delete All ?'}
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            onConfirm={deletAllPatients}
            okText="Delete All Patients"
            okButtonProps={{
              danger: true,
            }}
            cancelText="Cancel"
          >
            <Button type="primary" danger style={{ margin: 5 }}>
              <UsergroupDeleteOutlined /> Delete All
            </Button>
          </Popconfirm>

          <Button
            key="2"
            type="primary"
            onClick={() => {
              setIsDrawerVisible(true);
            }}
            style={{ margin: 5 }}
          >
            <UserAddOutlined /> New Patient
          </Button>
        </div>
      </AppHeader>

      <PatientsTable generateExpectations={generateExpectations} modifyPatient={modifyPatient} />

      <Expectations />
      <NewPatientDrawer
        isDrawerVisible={isDrawerVisible}
        closeDrawer={() => {
          setIsDrawerVisible(false);
          setModifiedPatientId(undefined);
        }}
        modifiedPatientId={modifiedPatientId}
      />
      <WelcomeModal
        isModalVisible={isModalVisible}
        closeModal={() => {
          setIsModalVisible(false);
        }}
      />
    </>
  );
};

export default RPOptimizer;
