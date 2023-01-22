import React, { useState } from "react";
import { Drawer, Form, Button, Col, Row, Input, InputNumber } from "antd";
import { useThemeSwitcher } from "react-css-theme-switcher";
import useMediaQuery from "../../../hooks/useMediaQuery";

const NewPatientDrawer = ({
  closeDrawer,
  isDrawerVisible,
  formRef,
  onAddPatient,
}) => {
  const { currentTheme } = useThemeSwitcher();
  const drawerWidth = useMediaQuery(
    "(max-width: 767px)",
    window.innerWidth,
    700
  );

  const [name, setName] = useState("");
  const [dose, setDose] = useState(0);
  const [duration, setDuration] = useState(0);

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
              formRef.current.submit();
            }}
          >
            Submit
          </Button>
        </div>
      }
    >
      <Form
        layout="vertical"
        ref={formRef}
        onFinish={() => {
          onAddPatient({ name, dose, duration });
        }}
      >
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
