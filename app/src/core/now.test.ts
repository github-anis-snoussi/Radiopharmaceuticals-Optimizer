import { PatientType } from '../context/PatientsContext';
import { RpSettingsType } from '../context/RpSettingsContext';
import { NowStatsType } from '../context/StatisticsContext';
import { currentStats } from './now';

describe('present state calculator algorithm', () => {

    const exampleRpSettings: RpSettingsType = {
        rpActivity: 3824,
        mesureTime: new Date(2021, 5, 10, 6, 0),
        rpHalfLife: 53,
        rpVol: 4,
        wastedVol: 1,
        unextractableVol: 1,
        labName: "Dexter's Laboratory"
    }

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

    describe('should correctly calculates the current state of the system', () => {

        beforeAll(() => {
            jest.useFakeTimers();
            jest.setSystemTime(new Date(2021, 5, 10, 7, 0));
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        test('will always output current state', () => {
            const result: NowStatsType = currentStats(
                [examplePatient1, examplePatient2, examplePatient3],
                exampleRpSettings,
            );

            expect(result.totalActivityNow).toBeDefined();
            expect(result.totalVolNow).toBeDefined();
            expect(result.usableActivityNow).toBeDefined();
            expect(result.usableVolNow).toBeDefined();
        });


    });

});