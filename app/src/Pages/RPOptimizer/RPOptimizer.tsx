import { useContext, useState } from 'react';
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
import { sort } from '../../core/sort';
import { generatePatientInjTimeList } from '../../core/maths';
import { moveInjectedToListHeadHelper } from '../../core/helpers';


const RPOptimizer = () => {
  const [modifiedPatientId, setModifiedPatientId] = useState<string | undefined>(undefined);
  const { patientsList, updatePatientsList } = useContext(PatientsContext) as PatientsContextType;
  const { rpSettings, hasInitSettings } = useContext(RpSettingsContext) as RpSettingsContextType;

  // app status
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(!hasInitSettings);

  const sortPatients = () => {
    updatePatientsList(sort(patientsList, rpSettings));
  };

  const deletAllPatients = () => {
    updatePatientsList([]);
  };

  const generateExpectations = () => {
    const newPatientlist = [...patientsList];
    moveInjectedToListHeadHelper(newPatientlist);
    const firstInjectionTime = newPatientlist[0].isInjected && newPatientlist[0].realInjectionTime ? newPatientlist[0].realInjectionTime : new Date()
    generatePatientInjTimeList(newPatientlist, firstInjectionTime,rpSettings)
    
    updatePatientsList(newPatientlist)
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
