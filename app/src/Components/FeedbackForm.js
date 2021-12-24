import React, {useState} from "react";
import {
  Typography,
  Form,
  Button,
  Rate,
  Result,
  Input,
  Row,
  Col,
} from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { send } from 'emailjs-com';


const { TextArea } = Input;
const { Title } = Typography;

const FeedbackForm = () => {

  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [stars, setStars] = useState(1)

  const onFinish = (values) => {
    let feedback = {...values, stars};

    const templateParams = {
      to_name: "Anis",
      from_name: feedback.name,
      message: feedback.description,
      stars: feedback.stars,
      version_ref: process.env.REACT_APP_VERCEL_GIT_COMMIT_SHA
    }

    send(
      process.env.REACT_APP_EMAILJS_SERVICE,
      process.env.REACT_APP_EMAILJS_TEMPLATE,
      {...templateParams}
    )

    setHasSubmitted(true)
  }

  if(!hasSubmitted) {
      return(
        <Form onFinish={onFinish}>
            <Row gutter={16}>

            <Col span={12}>
                <div style={{marginTop : 10}} >
                <Form.Item
                    name={["name"]}
                    label="Name"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                </div>
            </Col>

            <Col span={12}>
                <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent : 'center',
                }}
                >
                <Title level={4} style={{ marginRight: 20, paddingTop: 10 }}>
                    Your Opinion matters :
                </Title>
                <Rate defaultValue={stars} onChange={setStars} />
                </div>
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
      )
  } else {
      return(
        <Result
          icon={<SmileOutlined />}
          title="Thank you for your feedback."
        />
      )
  }


}

export default FeedbackForm;