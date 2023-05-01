import { PatientType } from '../context/PatientsContext';
import { sortingAfterEveryInjection } from './helpers';

describe('maths helpers', () => {

    const examplePatient1: PatientType = {
        id: 'patient-id-1',
        name: 'patient-1',
        dose: 30,
        duration: 45,
        isInjected: false
    }

    const examplePatient2: PatientType = {
        id: 'patient-id-2',
        name: 'patient-2',
        dose: 30,
        duration: 45,
        isInjected: false
    }

    const examplePatient3: PatientType = {
        id: 'patient-id-3',
        name: 'patient-3',
        dose: 30,
        duration: 45,
        isInjected: false
    }

    describe('should correctly order patient list', () => {
        test('should not change list if no patients are injected', () => {
            const patientList: PatientType[] = [
                {
                    ...examplePatient1,
                },
                {
                    ...examplePatient2,
                },
                {
                    ...examplePatient3,
                }
            ]
            sortingAfterEveryInjection(patientList)

            expect(patientList.length).toBe(3);
            expect(patientList[0].id).toBe("patient-id-1");
            expect(patientList[1].id).toBe("patient-id-2");
            expect(patientList[2].id).toBe("patient-id-3");
            expect(patientList[0].isInjected).toBe(false);
            expect(patientList[1].isInjected).toBe(false);
            expect(patientList[2].isInjected).toBe(false);
        });
        test('should move injected patients to the start - 1', () => {
            const patientList: PatientType[] = [
                {
                    ...examplePatient1,
                },
                {
                    ...examplePatient2,
                },
                {
                    ...examplePatient3,
                    isInjected: true,
                    realInjectionTime: new Date(2021, 5, 10, 7, 0),
                }
            ]
            sortingAfterEveryInjection(patientList)

            expect(patientList.length).toBe(3);
            expect(patientList[0].id).toBe("patient-id-3");
            expect(patientList[1].id).toBe("patient-id-1");
            expect(patientList[2].id).toBe("patient-id-2");
            expect(patientList[0].isInjected).toBe(true);
            expect(patientList[1].isInjected).toBe(false);
            expect(patientList[2].isInjected).toBe(false);
        });
        test('should move injected patients to the start - 2', () => {
            const patientList: PatientType[] = [
                {
                    ...examplePatient1,
                },
                {
                    ...examplePatient2,
                    isInjected: true,
                    realInjectionTime: new Date(2021, 5, 10, 7, 0),
                },
                {
                    ...examplePatient3,
                }
            ]
            sortingAfterEveryInjection(patientList)

            expect(patientList.length).toBe(3);
            expect(patientList[0].id).toBe("patient-id-2");
            expect(patientList[1].id).toBe("patient-id-1");
            expect(patientList[2].id).toBe("patient-id-3");
            expect(patientList[0].isInjected).toBe(true);
            expect(patientList[1].isInjected).toBe(false);
            expect(patientList[2].isInjected).toBe(false);
        });
        test('should keep injected patients at start - 1', () => {
            const patientList: PatientType[] = [
                {
                    ...examplePatient1,
                    isInjected: true,
                    realInjectionTime: new Date(2021, 5, 10, 7, 0),
                },
                {
                    ...examplePatient2,
                },
                {
                    ...examplePatient3,
                }
            ]
            sortingAfterEveryInjection(patientList)

            expect(patientList.length).toBe(3);
            expect(patientList[0].id).toBe("patient-id-1");
            expect(patientList[1].id).toBe("patient-id-2");
            expect(patientList[2].id).toBe("patient-id-3");
            expect(patientList[0].isInjected).toBe(true);
            expect(patientList[1].isInjected).toBe(false);
            expect(patientList[2].isInjected).toBe(false);
        });
        test('should keep injected patients at start - 2', () => {
            const patientList: PatientType[] = [
                {
                    ...examplePatient1,
                    isInjected: true,
                    realInjectionTime: new Date(2021, 5, 10, 7, 0),
                },
                {
                    ...examplePatient2,
                    isInjected: true,
                    realInjectionTime: new Date(2021, 5, 10, 7, 45),
                },
                {
                    ...examplePatient3,
                }
            ]
            sortingAfterEveryInjection(patientList)

            expect(patientList.length).toBe(3);
            expect(patientList[0].id).toBe("patient-id-1");
            expect(patientList[1].id).toBe("patient-id-2");
            expect(patientList[2].id).toBe("patient-id-3");
            expect(patientList[0].isInjected).toBe(true);
            expect(patientList[1].isInjected).toBe(true);
            expect(patientList[2].isInjected).toBe(false);
        });
        test('should keep injected patients at start - 3', () => {
            const patientList: PatientType[] = [
                {
                    ...examplePatient1,
                    isInjected: true,
                    realInjectionTime: new Date(2021, 5, 10, 7, 0),
                },
                {
                    ...examplePatient2,
                    isInjected: true,
                    realInjectionTime: new Date(2021, 5, 10, 7, 45),
                },
                {
                    ...examplePatient3,
                    isInjected: true,
                    realInjectionTime: new Date(2021, 5, 10, 8, 30),
                }
            ]
            sortingAfterEveryInjection(patientList)

            expect(patientList.length).toBe(3);
            expect(patientList[0].id).toBe("patient-id-1");
            expect(patientList[1].id).toBe("patient-id-2");
            expect(patientList[2].id).toBe("patient-id-3");
            expect(patientList[0].isInjected).toBe(true);
            expect(patientList[1].isInjected).toBe(true);
            expect(patientList[2].isInjected).toBe(true);
        });
        test('should sort injected patients at start - 1', () => {
            const patientList: PatientType[] = [
                {
                    ...examplePatient1,
                    isInjected: true,
                    realInjectionTime: new Date(2021, 5, 10, 7, 0),
                },
                {
                    ...examplePatient2,
                    isInjected: true,
                    realInjectionTime: new Date(2021, 5, 10, 7, 45),
                },
                {
                    ...examplePatient3,
                    isInjected: true,
                    realInjectionTime: new Date(2021, 5, 10, 8, 30),
                }
            ]
            sortingAfterEveryInjection(patientList)

            expect(patientList.length).toBe(3);
            expect(patientList[0].id).toBe("patient-id-1");
            expect(patientList[1].id).toBe("patient-id-2");
            expect(patientList[2].id).toBe("patient-id-3");
            expect(patientList[0].isInjected).toBe(true);
            expect(patientList[1].isInjected).toBe(true);
            expect(patientList[2].isInjected).toBe(true);
        });
        test('should sort injected patients at start - 2', () => {
            const patientList: PatientType[] = [
                {
                    ...examplePatient1,
                    isInjected: true,
                    realInjectionTime: new Date(2021, 5, 10, 7, 45),
                },
                {
                    ...examplePatient2,
                    isInjected: true,
                    realInjectionTime: new Date(2021, 5, 10, 7, 0),
                },
                {
                    ...examplePatient3,
                    isInjected: true,
                    realInjectionTime: new Date(2021, 5, 10, 8, 30),
                }
            ]
            sortingAfterEveryInjection(patientList)

            expect(patientList.length).toBe(3);
            expect(patientList[0].id).toBe("patient-id-2");
            expect(patientList[1].id).toBe("patient-id-1");
            expect(patientList[2].id).toBe("patient-id-3");
            expect(patientList[0].isInjected).toBe(true);
            expect(patientList[1].isInjected).toBe(true);
            expect(patientList[2].isInjected).toBe(true);
        });
    });

});