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
      (x) => x.id === restProps["data-row-key"]
    );
    return <SortableItem index={index} {...restProps} />;
  };

  const updateRecordMeasureTime = (record, mesureTime) => {
    let patients = [...patientsList];
    patients.forEach(function (part, index, theArray) {
      if (theArray[index].id === record.id) {
        theArray[index].realInjectionTime = new Date(mesureTime);
      }
    });
    updateData(patients);
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
      rowKey="id"
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
