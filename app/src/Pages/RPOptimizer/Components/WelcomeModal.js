import React from "react";
import {
  Typography,
  Modal,
  DatePicker,
  Divider,
  Button,
  Col,
  Row,
  Input,
  InputNumber,
  Tag,
} from "antd";
import { BankOutlined } from "@ant-design/icons";
import moment from "moment";
import ThemeSwitcher from "./ThemeSwitcher";

const { Text } = Typography;

const WelcomeModal = ({
  isModalVisible,
  closeModal,
  confirmSettings,
  settings,
  setSettings,
}) => {
  return (
    <Modal
      title="Welcome"
      visible={isModalVisible}
      onCancel={closeModal}
      footer={[
        <Button
          key={1}
          type="primary"
          onClick={confirmSettings}
          disabled={!settings.mesureTime || !settings.firstInjTime}
        >
          Confirm
        </Button>,
      ]}
    >
      <Text type="secondary">Enter your name</Text>
      <Input
        placeholder="Lab name"
        prefix={<BankOutlined />}
        value={settings.name}
        onChange={(name) => {
          setSettings({ ...settings, name: name.target.value });
        }}
      />
      <Row gutter={16} style={{ marginBottom: 10, marginTop: 15 }}>
        <Col className="gutter-row" span={10}>
          <Text type="secondary">RP Half Life (min)</Text>
        </Col>
        <Col className="gutter-row" span={14}>
          <InputNumber
            style={{ width: "100%" }}
            value={settings.rpHalfLife}
            onChange={(rpHalfLife) => {
              setSettings({ ...settings, rpHalfLife: rpHalfLife });
            }}
          />
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 10 }}>
        <Col className="gutter-row" span={10}>
          <Text type="secondary">RP Activity (MBq)</Text>
        </Col>
        <Col className="gutter-row" span={14}>
          <InputNumber
            style={{ width: "100%" }}
            value={settings.rpActivity}
            onChange={(rpActivity) => {
              setSettings({ ...settings, rpActivity: rpActivity });
            }}
          />
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 10 }}>
        <Col className="gutter-row" span={10}>
          <Text type="secondary">Measure Time</Text>
        </Col>
        <Col className="gutter-row" span={14}>
          <DatePicker
            showTime
            style={{ width: "100%" }}
            value={settings.mesureTime ? moment(settings.mesureTime) : null}
            onChange={(mesureTime) => {
              setSettings({ ...settings, mesureTime: mesureTime });
            }}
          />
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 10 }}>
        <Col className="gutter-row" span={10}>
          <Text type="secondary">First Injection Time</Text>
        </Col>
        <Col className="gutter-row" span={14}>
          <DatePicker
            showTime
            style={{ width: "100%" }}
            value={settings.firstInjTime ? moment(settings.firstInjTime) : null}
            onChange={(firstInjTime) => {
              setSettings({ ...settings, firstInjTime: firstInjTime });
            }}
          />
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 10 }}>
        <Col className="gutter-row" span={10}>
          <Text type="secondary">RP Volume (ml)</Text>
        </Col>
        <Col className="gutter-row" span={14}>
          <InputNumber
            style={{ width: "100%" }}
            value={settings.rpVol}
            onChange={(rpVol) => {
              setSettings({ ...settings, rpVol: rpVol });
            }}
          />
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 10 }}>
        <Col className="gutter-row" span={10}>
          <Text type="secondary">Wasted Volume (ml)</Text>
        </Col>
        <Col className="gutter-row" span={14}>
          <InputNumber
            style={{ width: "100%" }}
            value={settings.wastedVol}
            onChange={(wastedVol) => {
              setSettings({ ...settings, wastedVol: wastedVol });
            }}
          />
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 10 }}>
        <Col className="gutter-row" span={10}>
          <Text type="secondary">Unextractable Volume (ml)</Text>
        </Col>
        <Col className="gutter-row" span={14}>
          <InputNumber
            style={{ width: "100%" }}
            value={settings.unextractableVol}
            onChange={(unextractableVol) => {
              setSettings({
                ...settings,
                unextractableVol: unextractableVol,
              });
            }}
          />
        </Col>
      </Row>

      <Divider orientation="left">Settings </Divider>

      <Row gutter={16} style={{ marginBottom: 10 }}>
        <Col className="gutter-row" span={20}>
          <Text type="secondary">
            Dark mode <Tag color="blue">New</Tag>{" "}
          </Text>
        </Col>
        <Col className="gutter-row" span={4}>
          <ThemeSwitcher />
        </Col>
      </Row>
    </Modal>
  );
};

export default WelcomeModal;
