import React from "react";
import "../App.css";
import "antd/dist/antd.css";
import {
  Typography,
  Divider,
  Form,
  Button,
  Input,
  Rate,
  Result,
  Row,
  Col,
} from "antd";
import { SmileOutlined } from "@ant-design/icons";
const { Title, Paragraph, Text, Link } = Typography;
const { TextArea } = Input;
class Infos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "submiting", // or can be submited
    };
    this.onFinish = this.onFinish.bind(this);
  }

  onFinish(values) {
    console.log(values);
    this.setState({ status: "submited" });
  }

  render() {
    return (
      <>
        <Typography>
          <Title>Radiopharmaceuticals Optimizer</Title>
          <Paragraph>
          Rp Optimizer (short for Radiopharmaceuticals Optimizer) is an open source web app used to make the use of Radioactive pharmaceuticals used in the detection of cancerous cells more efficient during PET scans.
          This app was designed and built with one goal in mind :
            <Text strong>
              use IT to make an impact and give back to the community as much as possible
            </Text>
            .
          </Paragraph>
          <Title level={2}>Case Study</Title>
          <Paragraph>
            The Sahloul University Hospital ,being the first Hospital to make use of this app, had a great deal of impact on the development process. In fact this app was built solely for Sahloul University Hospital but then I decided to open source it.
          </Paragraph>
          <Paragraph>
            At said hospital, the PET (Positron emission tomography) unit used fluor 18 marked fluorodeoxyglucose who's radioactivity allowed the PET camera to visualise the cancerous cells during the scan.
          </Paragraph>
          <Paragraph>
            This pharmaceutical is both expensive and his radioactivity decrease rapidly (half life of 110 min).
          </Paragraph>
          <Paragraph>
            On the scan day, the PET unit receives the pharmaceutical and it has to decide on how to decide on an optimal way to divide it between several patients (each with different needs in term of : scan time and required radioactivity needed for the scan).
          </Paragraph>
          <Paragraph>
            In comes our app whose purpose is to effectively and efficiently order patients during a PET scan given an initial state, and also to show usefull statistics and predictions that are crucial for the PET machine operator.
          </Paragraph>
        </Typography>

        {/* <Divider />

        {this.state.status === "submiting" ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Title level={4} style={{ marginRight: 20, paddingTop: 10 }}>
                Your Opinion matters :{" "}
              </Title>
              <Rate defaultValue={1} />
            </div>
            <Form onFinish={this.onFinish}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name={["name"]}
                    label="Name"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={["email"]}
                    label="Email"
                    rules={[{ type: "email", required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name={["description"]} rules={[{ required: true }]}>
                <TextArea rows={4} onChange={() => {}} value={""} />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" type="primary">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </>
        ) : (
          <Result
            icon={<SmileOutlined />}
            title="Thank you for your feedback."
          />
        )} */}
      </>
    );
  }
}

export default Infos;
