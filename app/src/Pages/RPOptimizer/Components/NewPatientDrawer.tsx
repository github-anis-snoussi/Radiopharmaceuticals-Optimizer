import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  InputNumber,
  FormInstance,
} from "antd";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { v4 as uuidv4 } from "uuid";
import useMediaQuery from "../../../hooks/useMediaQuery";
import { Context } from "../../../Context";

const NewPatientDrawer = ({
  closeDrawer,
  isDrawerVisible,
  modifiedPatientId,
}: {
  closeDrawer: any;
  isDrawerVisible: any;
  modifiedPatientId: any;
}) => {
  const { currentTheme } = useThemeSwitcher();
  const newPatientForm = useRef<FormInstance<any> | null>(null);
  const drawerWidth = useMediaQuery(
    "(max-width: 767px)",
    window.innerWidth,
    700
  );

  const { patientsList, addPatient, updatePatient } = useContext(Context);

  const [name, setName] = useState("");
  const [dose, setDose] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (modifiedPatientId) {
      let modifiedPatient = patientsList.find(
        (element: any) => element.id === modifiedPatientId
      );
      setName(modifiedPatient.name);
      setDose(modifiedPatient.dose);
      setDuration(modifiedPatient.duration);
    }
  }, []);

  const finishedEdit = () => {
    if (modifiedPatientId) {
      updatePatient({ id: modifiedPatientId, name, dose, duration });
    } else {
      addPatient({ id: uuidv4(), name, dose, duration });
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
        backgroundColor: currentTheme === "dark" ? "#1f1f1f" : "white",
      }}
      footer={
        <div
          style={{
            textAlign: "right",
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
      <Form layout="vertical" ref={newPatientForm} onFinish={finishedEdit}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter user name" }]}
            >
              <Input
                placeholder="Please enter user name"
                onChange={(name) => {
                  setName(name.target.value);
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="dose"
              label="Dose (MBq)"
              rules={[{ required: true, message: "Please enter the dose" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                onChange={(dose) => {
                  setDose(dose);
                }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="duration"
              label="Scan Duration (min)"
              rules={[{ required: true, message: "Please enter the duration" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                onChange={(duration) => {
                  setDuration(duration);
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
