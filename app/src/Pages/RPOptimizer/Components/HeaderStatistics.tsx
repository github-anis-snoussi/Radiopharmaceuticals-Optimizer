import React from "react";
import { Row, Statistic, Progress } from "antd";

const HeaderStatistics = ({
  rpActivity,
  mesureTime,
  rpVol,
  rpHalfLife,
  now,
  total,
}) => {
  return (
    <>
      <Row>
        <Statistic
          title="RP Activity"
          suffix="MBq"
          value={rpActivity}
          style={{ margin: 10 }}
        />
        <Statistic
          title="Measure Time"
          value={new Date(mesureTime).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          style={{ margin: 10 }}
        />
        <Statistic
          title="RP Volume"
          suffix="ml"
          value={rpVol}
          style={{ margin: 10 }}
        />
        <Statistic
          title="RP Half Life"
          suffix="min"
          value={rpHalfLife}
          style={{ margin: 10 }}
        />
      </Row>
      <Row>
        {now && Object.keys(now).length !== 0 ? (
          <Progress
            style={{ paddingRight: 20 }}
            strokeColor={{
              "0%": "red",
              "100%": "green",
            }}
            percent={(now.totalActivityNow / total) * 100}
            format={(percent) => `${((percent * total) / 100).toFixed(0)} MBq`}
          />
        ) : null}
      </Row>
    </>
  );
};

export default HeaderStatistics;
