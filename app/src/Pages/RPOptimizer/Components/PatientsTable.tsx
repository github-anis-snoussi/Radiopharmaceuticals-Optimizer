import { useContext, useState, useCallback } from 'react';
import { Table, message } from 'antd';
import { SortableContainer as BaseSortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import TableColums from './TableColums';
import { PatientsContext, PatientsContextType } from '../../../context/PatientsContext';

const SortableItem = SortableElement((props: any) => <tr {...props} />);
const SortableContainer = BaseSortableContainer((props: any) => <tbody {...props} />);

const PatientsTable = ({
  generateExpectations,
  modifyPatient,
}: {
  generateExpectations: () => void;
  modifyPatient: (id: string) => void;
}) => {
  const { patientsList, updatePatientsList, deletePatient } = useContext(PatientsContext) as PatientsContextType;

  const [selectedInjectionTime, setSelectedInjectionTime] = useState<string | undefined>(undefined);

  const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: any; newIndex: any }) => {
    if (patientsList[newIndex].isInjected) {
      return;
    } else if (oldIndex !== newIndex) {
      const newData = arrayMove([...patientsList], oldIndex, newIndex).filter(el => !!el);
      updatePatientsList(newData);
    }
    generateExpectations();
  };

  const injectPatient = (id: string) => {
    if (!selectedInjectionTime) {
      message.warning('Please select Injection time first.');
    }
    console.log('Injecting patient: ', id);
  };

  const setInjTime = useCallback((time: string) => {
    setSelectedInjectionTime(time.toString());
  }, []);

  const DraggableContainer = (props: any) => (
    <SortableContainer useDragHandle disableAutoscroll helperClass="row-dragging" onSortEnd={onSortEnd} {...props} />
  );

  const DraggableBodyRow = ({ className, style, ...restProps }: { className: any; style: any; [x: string]: any }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = patientsList.findIndex((x: any) => x.id === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  return (
    <Table
      pagination={false}
      scroll={{ x: 950 }}
      dataSource={patientsList}
      columns={TableColums(injectPatient, deletePatient, setInjTime, modifyPatient)}
      rowKey={patient => patient.id}
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
