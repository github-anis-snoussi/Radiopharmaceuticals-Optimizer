import React from "react";
import { Statistic, Row, Col, Typography } from 'antd';
import { BranchesOutlined, ExperimentOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;



class Expectations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
      }


  render() {
      const { 
          total_remaining_activity, 
          usable_remaining_activity, 
          total_remaining_vol,
          usable_remaining_vol,
          remaining_activity_time
        } = this.props;


        return (
            <div style={{marginTop : 20}} >
                <Row>
                    <Col span={16}>
                        <div style={{ display : 'flex' ,justifyContent : 'flex-end', marginRight : 20}} >
                            <Title level={3}> <ExperimentOutlined /> Expectations : </Title>
                        </div>
                        <div style={{ display : 'flex' ,justifyContent : 'flex-end', marginRight : 50, marginTop : -10}} >
                            <Text mark>(experimental <BranchesOutlined />) </Text>
                        </div>
                    </Col>
                    <Col span={4}>
                        <Statistic title="Total Remaining Activity" value={total_remaining_activity || '?'} suffix="MBq" />
                        <Statistic title="Usable Remaining Activity" value={usable_remaining_activity || '?'} suffix="MBq" />
                    </Col>
                    <Col span={4}>
                        <Statistic title="Total Remaining Volume" value={total_remaining_vol || '?'} suffix="ml" />
                        <Statistic title="Usable Remaining Volume" value={usable_remaining_vol || '?'} suffix="ml" />
                    </Col>
                </Row>
                <Row>
                    <Col span={16} />
                    <Col span={8} >
                        <div style={{display : 'flex', justifyContent : 'center', marginTop : 20, backgroundColor : '#ececec', textAlign : 'center' }} >
                            <Statistic title="Remaining Activity Time" value={remaining_activity_time ? new Date(remaining_activity_time).toLocaleTimeString('en-GB', {
                                hour: "2-digit",
                                minute: "2-digit",
                            }) : '?'}  />
                        </div>
                    </Col>
                </Row>
            </div>
        );
  }
}

export default Expectations;
