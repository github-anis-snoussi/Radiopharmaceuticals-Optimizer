import React from "react";
import { Table } from "antd";
import { sortableContainer, sortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";
import TableColums from "./TableColums";

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

const PatientsTable = ({
  modifyPatient,
  deletePatient,
  patientsList,
  updateData,
  generateExpectations,
}) => {
  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (patientsList[newIndex].isInjected) {
      return;
    } else if (oldIndex !== newIndex) {
      const newData = arrayMove(
        [].concat(patientsList),
        oldIndex,
        newIndex
      ).filter((el) => !!el);
      // console.log('Sorted items: ', newData);
      updateData(newData);
    }
    generateExpectations();
  };

  const DraggableContainer = (props) => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = patientsList.findIndex(
      (x) => x.index === restProps["data-row-key"]
    );
    return <SortableItem index={index} {...restProps} />;
  };

  const updateRecordMeasureTime = (record, mesureTime) => {
    patientsList.forEach(function (part, index, theArray) {
      if (theArray[index].index === record.index) {
        theArray[index].realInjectionTime = new Date(mesureTime);
      }
    });
    updateData([...patientsList]);
  };

  return (
    <Table
      pagination={false}
      scroll={{ x: 950 }}
      dataSource={patientsList}
      columns={TableColums(
        modifyPatient,
        deletePatient,
        updateRecordMeasureTime,
        patientsList,
        updateData
      )}
      rowKey="index"
      components={{
        body: {
          wrapper: DraggableContainer,
          row: DraggableBodyRow,
        },
      }}
    />
  );
};

export default PatientsTable;
