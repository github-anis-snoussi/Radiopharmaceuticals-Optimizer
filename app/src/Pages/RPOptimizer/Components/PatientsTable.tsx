import { useContext } from 'react';
import { Table } from 'antd';
import { SortableContainer as BaseSortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import TableColums from './TableColums';
import { PatientsContext, PatientsContextType } from '../../../context/PatientsContext';

const SortableItem = SortableElement((props: any) => <tr {...props} />);
const SortableContainer = BaseSortableContainer((props: any) => <tbody {...props} />);

const PatientsTable = ({ generateExpectations }: { generateExpectations: any }) => {
  const { patientsList, updatePatient, updatePatientsList, deletePatient } = useContext(
    PatientsContext,
  ) as PatientsContextType;

  const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: any; newIndex: any }) => {
    if (patientsList[newIndex].isInjected) {
      return;
    } else if (oldIndex !== newIndex) {
      const newData = arrayMove([...patientsList], oldIndex, newIndex).filter(el => !!el);
      updatePatientsList(newData);
    }
    generateExpectations();
  };

  const DraggableContainer = (props: any) => (
    <SortableContainer useDragHandle disableAutoscroll helperClass="row-dragging" onSortEnd={onSortEnd} {...props} />
  );

  const DraggableBodyRow = ({ className, style, ...restProps }: { className: any; style: any; [x: string]: any }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = patientsList.findIndex((x: any) => x.id === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  const updateRecordMeasureTime = (record: any, mesureTime: any) => {
    let patients = [...patientsList];
    patients.forEach(function (part, index, theArray) {
      if (theArray[index].id === record.id) {
        theArray[index].realInjectionTime = new Date(mesureTime).toDateString();
      }
    });
    updatePatientsList(patients);
  };

  return (
    <Table
      pagination={false}
      scroll={{ x: 950 }}
      dataSource={patientsList}
      // @ts-ignore */
      columns={TableColums(updatePatient, deletePatient, updateRecordMeasureTime, patientsList, updateData)}
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
