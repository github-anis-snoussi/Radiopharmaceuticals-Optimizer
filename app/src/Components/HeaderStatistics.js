import React from "react";
import { Row, Statistic, Progress } from "antd";

const HeaderStatistics = ({
  rp_activity,
  mesure_time,
  rp_vol,
  rp_half_life,
  now,
  total,
}) => {
  return (
    <Row>
      <Statistic title="RP Activity" suffix="MBq" value={rp_activity} />
      <Statistic
        title="Measure Time"
        value={new Date(mesure_time).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })}
        style={{
          margin: "0 32px",
        }}
      />
      <Statistic title="RP Volume" suffix="ml" value={rp_vol} />
      <Statistic
        title="RP Half Life"
        suffix="min"
        value={rp_half_life}
        style={{
          margin: "0 32px",
        }}
      />
      {now && Object.keys(now).length !== 0 ? (
        <Progress
          style={{ paddingRight: 20 }}
          strokeColor={{
            "0%": "red",
            "100%": "green",
          }}
          percent={(now.total_activity_now / total) * 100}
          format={(percent) => `${((percent * total) / 100).toFixed(0)} MBq`}
        />
      ) : null}
    </Row>
  );
};

export default HeaderStatistics;
