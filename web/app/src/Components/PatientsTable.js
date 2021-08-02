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

import { formatFront2Back, formatBack2Front } from "../utils/utils";
import axios from "../utils/axios";

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

    axios
      .post("clean", { patient_list: formatedPatientInfos })
      .then((res) => {
        let cleaned_list = res.data.cleaned_list;
        const newFormatedPatients = formatBack2Front(cleaned_list);

        // we update the list and show a message
        updateData([...newFormatedPatients]);
        message.success("Patient injected");
      })
      .catch((e) => {
        console.log(e);
        message.error("Something went wrong.");
      });
  }
}

function cancelInjection() {
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
        render: (text) => <Text style={{ color: "#1890ff" }}>{text}</Text>,
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
          <Space size="middle">
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
                onCancel={cancelInjection}
                okText="Inject"
                cancelText="Cancel"
              >
                <Button size="small">Inject {record.name}</Button>
              </Popconfirm>
            ) : (
              <Button size="small" disabled>
                Inject {record.name}
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
