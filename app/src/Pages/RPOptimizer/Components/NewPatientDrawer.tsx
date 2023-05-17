import { useState, useRef, useEffect, useContext } from 'react';
import { Drawer, Form, Button, Col, Row, Input, InputNumber, FormInstance } from 'antd';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import { v4 as uuidv4 } from 'uuid';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { PatientsContext, PatientsContextType } from '../../../context/PatientsContext';

const NewPatientDrawer = ({
  closeDrawer,
  isDrawerVisible,
  modifiedPatientId,
}: {
  closeDrawer: () => void;
  isDrawerVisible: boolean;
  modifiedPatientId?: string;
}) => {
  const { currentTheme } = useThemeSwitcher();
  const drawerWidth = useMediaQuery('(max-width: 767px)', window.innerWidth, 700);
  const newPatientForm = useRef<FormInstance<any> | null>(null);
  const [form] = Form.useForm();

  const { patientsList, addPatient, updatePatient } = useContext(PatientsContext) as PatientsContextType;

  const [name, setName] = useState<string>('');
  const [dose, setDose] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    if (modifiedPatientId) {
      let modifiedPatient = patientsList.find((element: any) => element.id === modifiedPatientId);
      form.setFieldsValue({
        name: modifiedPatient?.name ?? '',
        dose: modifiedPatient?.dose ?? 0,
        duration: modifiedPatient?.duration ?? 0,
      });
      // Also update state with patients values
      setName(modifiedPatient?.name ?? '');
      setDose(modifiedPatient?.dose ?? 0);
      setDuration(modifiedPatient?.duration ?? 0);
    }
  }, [modifiedPatientId, patientsList, form]);

  const finishedEdit = () => {
    if (modifiedPatientId) {
      updatePatient({ id: modifiedPatientId, name, dose, duration });
    } else {
      addPatient({ id: uuidv4(), name, dose, duration, isInjected: false });
    }
    closeDrawer();
  };

  return (
    <Drawer
      title="Add new Patient"
      width={drawerWidth}
      onClose={closeDrawer}
      visible={isDrawerVisible}
      bodyStyle={{
        paddingBottom: 80,
        backgroundColor: currentTheme === 'dark' ? '#1f1f1f' : 'white',
      }}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={() => {
              newPatientForm?.current?.submit();
            }}
          >
            Submit
          </Button>
        </div>
      }
    >
      <Form layout="vertical" ref={newPatientForm} onFinish={finishedEdit} form={form}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter user name' }]}>
              <Input
                placeholder="Please enter user name"
                value={name}
                onChange={(name : React.ChangeEvent<HTMLInputElement>) => {
                  setName(name.target.value);
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="dose" label="Dose (MBq)" rules={[{ required: true, message: 'Please enter the dose' }]}>
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                value={dose}
                onChange={(dose: number | null) => {
                  if(dose) setDose(dose);
                }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="duration"
              label="Scan Duration (min)"
              rules={[{ required: true, message: 'Please enter the duration' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                value={duration}
                onChange={(duration: number | null) => {
                  if(duration) setDuration(duration);
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default NewPatientDrawer;
