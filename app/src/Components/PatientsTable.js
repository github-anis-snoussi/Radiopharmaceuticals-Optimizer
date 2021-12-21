import React from "react";
import "../App.css";
import "antd/dist/antd.css";

import {
  Table,
  Space,
  Button,
  Popconfirm,
  message,
  Spin,
  Typography,
  TimePicker,
} from "antd";
import {
  MenuOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import arrayMove from "array-move";
import { DeleteOutlined, EditOutlined, ExperimentOutlined } from "@ant-design/icons";

import { formatFront2Back, formatBack2Front } from "../utils/utils";
import {sorting_after_every_injection} from "../utils/sort_patient_list"

const { Text } = Typography;

const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: "pointer", color: "#999" }} />
));

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

function confirmInjection(record, dataSource, updateData) {
  if (record.realInjectionTime === null) {
    message.warning("Operation aborted");
  } else {
    // we change the status to injected
    dataSource.forEach(function (part, index, theArray) {
      if (theArray[index].index === record.index) {
        theArray[index].status = "done";
      }
    });

    // we clean the list
    const formatedPatientInfos = formatFront2Back(dataSource);
    sorting_after_every_injection(formatedPatientInfos)
    const newFormatedPatients = formatBack2Front(formatedPatientInfos);
    updateData([...newFormatedPatients]);
    message.success("Patient injected");
  }
}

function cancelOp() {
  return;
}

class PatientsTable extends React.Component {
  constructor(props) {
    super(props);
    this.tableColums = this.tableColums.bind(this);
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { dataSource } = this.props;
    if (dataSource[newIndex].status !== "waiting") {
      return;
    } else if (oldIndex !== newIndex) {
      const newData = arrayMove(
        [].concat(dataSource),
        oldIndex,
        newIndex
      ).filter((el) => !!el);
      // console.log('Sorted items: ', newData);
      this.props.updateData(newData);
    }
    this.props.generateExpectations()
  };

  DraggableContainer = (props) => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={this.onSortEnd}
      {...props}
    />
  );

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { dataSource } = this.props;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(
      (x) => x.index === restProps["data-row-key"]
    );
    return <SortableItem index={index} {...restProps} />;
  };

  updateRecordMeasureTime = (record, mesure_time) => {
    const { dataSource, updateData } = this.props;
    dataSource.forEach(function (part, index, theArray) {
      if (theArray[index].index === record.index) {
        theArray[index].realInjectionTime = mesure_time;
      }
    });
    updateData([...dataSource]);
  };

  tableColums = () => {
    const columns = [
      {
        title: "Sort",
        dataIndex: "sort",
        width: 30,
        className: "drag-visible",
        render: (a, b) => {
          if (b.status === "waiting") {
            return <DragHandle />;
          }
        },
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text) => <Text strong >{text}</Text>,
      },
      {
        title: () => {return <div style={{textAlign : 'center'}} > <ExperimentOutlined/> Injection time</div>},
        dataIndex: "expected_injection_time",
        key: "expected_injection_time",
        render(text) {
          return {
            props: {
              style: { background: "#fffbe6" }
            },
            children: <p>{text || '?'}</p>
          };
        }
      },
      {
        title: () => {return <div style={{textAlign : 'center'}} > <ExperimentOutlined/> Injection volume (ml) </div>},
        dataIndex: "expected_injection_volume",
        key: "expected_injection_volume",
        render(text) {
          return {
            props: {
              style: { background: "#fffbe6" }
            },
            children: <p>{text || '?'}</p>
          };
        }
      },
      {
        title: "Dose (MBq)",
        dataIndex: "dose",
        key: "dose",
      },
      {
        title: "Test Duration (min)",
        dataIndex: "duration",
        key: "duration",
        render: (text) => <p>{text}</p>,
      },
      {
        title: "Actions",
        key: "action",
        render: (text, record) => (
          <Space>
            <Button
              size="small"
              type="primary"
              ghost
              disabled={record.status !== "waiting"}
              onClick={() => {
                this.props.modifyPatient(record);
              }}
            >
              <EditOutlined />
              Modify
            </Button>

            {record.status === "waiting" ? (
              <Popconfirm
                title={"Proceed to delete ?"}
                icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
                onConfirm={() => {
                  this.props.deletePatient(record);
                }}
                onCancel={cancelOp}
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

            {record.status === "waiting" ? (
              <Popconfirm
                title={
                  <>
                    <div>Select Injection Time for {record.name}</div>
                    <TimePicker
                      size="small"
                      style={{
                        width: "100%",
                        marginRight: 10,
                        marginTop: 10,
                        marginBottom: 10,
                      }}
                      onSelect={(mesure_time) => {
                        this.updateRecordMeasureTime(record, mesure_time);
                      }}
                    />
                  </>
                }
                onConfirm={() => {
                  if (!record.realInjectionTime) {
                    message.warning("Please select Injection time first.");
                  } else {
                    confirmInjection(
                      record,
                      this.props.dataSource,
                      this.props.updateData
                    );
                  }
                }}
                onCancel={cancelOp}
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
        key: "status",
        dataIndex: "status",
        render: (status) => {
          switch (status) {
            case "done":
              return (
                <CheckCircleOutlined
                  style={{ color: "green", fontSize: "23px" }}
                />
              );
            case "test":
              return <Spin />;
            case "waiting":
              return (
                <ClockCircleOutlined
                  style={{ color: "orange", fontSize: "23px" }}
                />
              );
            default:
              return (
                <ExclamationCircleOutlined
                  style={{ color: "red", fontSize: "23px" }}
                />
              );
          }
        },
      },
    ];

    return columns;
  };

  render() {
    return (
      <Table
        pagination={false}
        dataSource={this.props.dataSource}
        columns={this.tableColums()}
        rowKey="index"
        components={{
          body: {
            wrapper: this.DraggableContainer,
            row: this.DraggableBodyRow,
          },
        }}
      />
    );
  }
}

export default PatientsTable;
