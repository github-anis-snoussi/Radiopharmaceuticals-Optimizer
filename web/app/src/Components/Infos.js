import React from "react";
import "../App.css";
import "antd/dist/antd.css";
import { Typography, Divider, Form, Button, Input, Rate } from "antd";

const { Title, Paragraph, Text, Link } = Typography;
const { TextArea } = Input;
class Infos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <Typography>
          <Title>Introduction</Title>
          <Paragraph>
            In the process of internal desktop applications development, many
            different design specs and implementations would be involved, which
            might cause designers and developers difficulties and duplication
            and reduce the efficiency of development.
          </Paragraph>
          <Paragraph>
            After massive project practice and summaries, Ant Design, a design
            language for background applications, is refined by Ant UED Team,
            which aims to
            <Text strong>
              uniform the user interface specs for internal background projects,
              lower the unnecessary cost of design differences and
              implementation and liberate the resources of design and front-end
              development
            </Text>
            .
          </Paragraph>
          <Title level={2}>Guidelines and Resources</Title>
          <Paragraph>
            We supply a series of design principles, practical patterns and high
            quality design resources (<Text code>Sketch</Text> and{" "}
            <Text code>Axure</Text>), to help people create their product
            prototypes beautifully and efficiently.
          </Paragraph>

          <Paragraph>
            <ul>
              <li>
                <Link href="/docs/spec/proximity">Principles</Link>
              </li>
              <li>
                <Link href="/docs/spec/overview">Patterns</Link>
              </li>
              <li>
                <Link href="/docs/resources">Resource Download</Link>
              </li>
            </ul>
          </Paragraph>

          <Paragraph>
            Press <Text keyboard>Esc</Text> to exit...
          </Paragraph>
        </Typography>

        <Divider />
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

        <Form.Item>
          <TextArea rows={4} onChange={() => {}} value={""} />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" onClick={() => {}} type="primary">
            Submit
          </Button>
        </Form.Item>
      </>
    );
  }
}

export default Infos;
