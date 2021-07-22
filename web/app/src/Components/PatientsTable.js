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

const { Text } = Typography;

const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: "pointer", color: "#999" }} />
));

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

function confirm(record, dataSource, updateData) {
  if (record.injectionTime === null) {
    message.warning("Operation aborted");
  } else {
    dataSource.forEach(function (part, index, theArray) {
      if (theArray[index].index === record.index) {
        theArray[index].status = "done";
      }
    });
    updateData([...dataSource]);
    message.success("Patient injected");
  }
}

function cancel() {
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
        theArray[index].injectionTime = mesure_time;
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
        title: "Injection Time",
        key: "injectionTime",
        render: (text, record) => {
          if (record.status === "done") {
            return (
              <TimePicker
                size="small"
                defaultValue={record.injectionTime}
                disabled
              />
            );
          } else {
            return (
              <TimePicker
                size="small"
                onSelect={(mesure_time) => {
                  this.updateRecordMeasureTime(record, mesure_time);
                }}
              />
            );
          }
        },
      },
      {
        title: "Actions",
        key: "action",
        render: (text, record) => (
          <Space size="middle">
            <Popconfirm
              title={`Are you sure you want to Inject ${record.name}`}
              onConfirm={() =>
                confirm(record, this.props.dataSource, this.props.updateData)
              }
              onCancel={cancel}
              okText="Inject"
              cancelText="Cancel"
            >
              <Button size="small" disabled={record.status !== "waiting"}>
                Inject {record.name}
              </Button>
            </Popconfirm>
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
