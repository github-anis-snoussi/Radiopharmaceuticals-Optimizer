import React from "react";
import {
  Space,
  Button,
  Popconfirm,
  message,
  DatePicker,
  Typography,
} from "antd";
import {
  MenuOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { SortableHandle } from "react-sortable-hoc";
import { confirmInjection } from "../../../utils/utils";

const { Text } = Typography;

const DragHandle = SortableHandle(() => (
  <MenuOutlined style={{ cursor: "pointer", color: "#999" }} />
));

const TableColums = (
  modifyPatient: any,
  deletePatient: any,
  updateRecordMeasureTime: any,
  patientsList: any,
  updateData: any
) => {
  return [
    {
      title: "",
      fixed: "left",
      dataIndex: "sort",
      width: 30,
      className: "drag-visible",
      render: (a: any, b: any) => {
        if (b.isInjected === false) {
          return <DragHandle />;
        }
      },
    },
    {
      title: "Name",
      width: 80,
      fixed: "left",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: () => {
        return (
          <div style={{ textAlign: "center" }}>
            <ExperimentOutlined /> Injection time
          </div>
        );
      },
      width: 100,
      dataIndex: "expectedInjectionTime",
      key: "expectedInjectionTime",
      render(text: string) {
        return {
          props: {
            style: { background: "rgba(245, 206, 39, 0.41)" },
          },
          children: <Text>{text || "?"}</Text>,
        };
      },
    },
    {
      title: () => {
        return (
          <div style={{ textAlign: "center" }}>
            <ExperimentOutlined /> Injection volume (ml)
          </div>
        );
      },
      width: 100,
      dataIndex: "expectedInjectionVolume",
      key: "expectedInjectionVolume",
      render(text: string) {
        return {
          props: {
            style: { background: "rgba(245, 206, 39, 0.41)" },
          },
          children: <Text>{text || "?"}</Text>,
        };
      },
    },
    {
      title: "Dose (MBq)",
      width: 100,
      dataIndex: "dose",
      key: "dose",
    },
    {
      title: "Test Duration (min)",
      width: 100,
      dataIndex: "duration",
      key: "duration",
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: "Actions",
      width: 300,
      key: "action",
      render: (text: string, record: any) => (
        <Space>
          <Button
            size="small"
            type="primary"
            ghost
            disabled={record.isInjected}
            onClick={() => {
              modifyPatient(record);
            }}
          >
            <EditOutlined />
            Modify
          </Button>

          {record.isInjected === false ? (
            <Popconfirm
              title={"Proceed to delete ?"}
              icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => {
                deletePatient(record);
              }}
              okText="Delete Patient"
              okButtonProps={{
                danger: true,
              }}
              cancelText="Cancel"
            >
              <Button danger size="small">
                <DeleteOutlined />
                Delete
              </Button>
            </Popconfirm>
          ) : (
            <Button danger size="small" disabled>
              <DeleteOutlined />
              Delete
            </Button>
          )}

          {record.isInjected === false ? (
            <Popconfirm
              title={
                <>
                  <div>Select Injection Time for {record.name}</div>
                  <DatePicker
                    showTime
                    size="small"
                    style={{
                      width: "100%",
                      marginRight: 10,
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                    onSelect={(mesureTime) => {
                      updateRecordMeasureTime(record, mesureTime);
                    }}
                  />
                </>
              }
              onConfirm={() => {
                if (!record.realInjectionTime) {
                  message.warning("Please select Injection time first.");
                } else {
                  confirmInjection(record, patientsList, updateData);
                }
              }}
              okText="Inject"
              cancelText="Cancel"
            >
              <Button size="small"> 💉 Inject {record.name}</Button>
            </Popconfirm>
          ) : (
            <Button size="small" disabled>
              💉 Inject {record.name}
            </Button>
          )}
        </Space>
      ),
    },
    {
      title: "Status",
      width: 70,
      fixed: "right",
      key: "isInjected",
      dataIndex: "isInjected",
      render: (isInjected: boolean) => {
        if (isInjected) {
          return (
            <CheckCircleOutlined style={{ color: "green", fontSize: "23px" }} />
          );
        }
        return (
          <ClockCircleOutlined style={{ color: "orange", fontSize: "23px" }} />
        );
      },
    },
  ];
};

export default TableColums;
