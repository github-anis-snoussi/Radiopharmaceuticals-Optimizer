import React from "react";
import { Table } from "antd";
import { sortableContainer, sortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";
import TableColums from "./TableColums";

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

class PatientsTable extends React.Component {
  onSortEnd = ({ oldIndex, newIndex }) => {
    const { patientsList } = this.props;
    if (patientsList[newIndex].status !== "waiting") {
      return;
    } else if (oldIndex !== newIndex) {
      const newData = arrayMove(
        [].concat(patientsList),
        oldIndex,
        newIndex
      ).filter((el) => !!el);
      // console.log('Sorted items: ', newData);
      this.props.updateData(newData);
    }
    this.props.generateExpectations();
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
    const { patientsList } = this.props;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = patientsList.findIndex(
      (x) => x.index === restProps["data-row-key"]
    );
    return <SortableItem index={index} {...restProps} />;
  };

  updateRecordMeasureTime = (record, mesure_time) => {
    const { patientsList, updateData } = this.props;
    patientsList.forEach(function (part, index, theArray) {
      if (theArray[index].index === record.index) {
        theArray[index].realInjectionTime = new Date(mesure_time);
      }
    });
    updateData([...patientsList]);
  };

  render() {
    const { modifyPatient, deletePatient, patientsList, updateData } =
      this.props;
    return (
      <Table
        pagination={false}
        scroll={{ x: 950 }}
        dataSource={patientsList}
        columns={TableColums(
          modifyPatient,
          deletePatient,
          this.updateRecordMeasureTime,
          patientsList,
          updateData
        )}
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
