import React from "react";
import { Table } from "antd";
import { sortableContainer, sortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";
import TableColums from "./TableColums"

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

class PatientsTable extends React.Component {
  constructor(props) {
    super(props);
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
        theArray[index].realInjectionTime = new Date(mesure_time);
      }
    });
    updateData([...dataSource]);
  };


  render() {
    const { modifyPatient, deletePatient, updateRecordMeasureTime, dataSource, updateData } = this.props;
    return (
      <Table
        pagination={false}
        dataSource={dataSource}
        columns={TableColums(modifyPatient, deletePatient, updateRecordMeasureTime, dataSource, updateData)}
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
