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
} from "antd";
import { BankOutlined } from "@ant-design/icons";
import moment from "moment";
import { withContext } from "../utils/savableContext";

const { Text } = Typography;

const WelcomeModal = ({ isModalVisible, closeModal, confirmSettings, RPO }) => {
  const { settings, setSettings } = RPO;

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
          disabled={!settings.mesure_time || !settings.first_inj_time}
        >
          Confirm
        </Button>,
      ]}
    >
      <Row gutter={16} style={{ marginBottom: 10 }}>
        <Col className="gutter-row" span={10}>
          <Text type="secondary">RP Half Life (min)</Text>
        </Col>
        <Col className="gutter-row" span={14}>
          <InputNumber
            style={{ width: "100%" }}
            value={settings.rp_half_life}
            onChange={(rp_half_life) => {
              setSettings({ ...settings, rp_half_life: rp_half_life });
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
            value={settings.rp_activity}
            onChange={(rp_activity) => {
              setSettings({ ...settings, rp_activity: rp_activity });
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
            value={settings.mesure_time ? moment(settings.mesure_time) : null}
            onChange={(mesure_time) => {
              setSettings({ ...settings, mesure_time: mesure_time });
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
            value={
              settings.first_inj_time ? moment(settings.first_inj_time) : null
            }
            onChange={(first_inj_time) => {
              setSettings({ ...settings, first_inj_time: first_inj_time });
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
            value={settings.rp_vol}
            onChange={(rp_vol) => {
              setSettings({ ...settings, rp_vol: rp_vol });
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
            value={settings.wasted_vol}
            onChange={(wasted_vol) => {
              setSettings({ ...settings, wasted_vol: wasted_vol });
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
            value={settings.unextractable_vol}
            onChange={(unextractable_vol) => {
              setSettings({
                ...settings,
                unextractable_vol: unextractable_vol,
              });
            }}
          />
        </Col>
      </Row>

      <Divider orientation="left">Additional Data</Divider>
      <Input
        placeholder="Lab name"
        prefix={<BankOutlined />}
        value={settings.name}
        onChange={(name) => {
          setSettings({ ...settings, name: name.target.value });
        }}
      />
    </Modal>
  );
};

export default withContext(WelcomeModal);
