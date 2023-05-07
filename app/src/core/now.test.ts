import { PatientType } from '../context/PatientsContext';
import { RpSettingsType } from '../context/RpSettingsContext';
import { NowStatsType } from '../context/StatisticsContext';
import { currentStats } from './now';

describe('present state calculator algorithm', () => {

    const exampleRpSettings: RpSettingsType = {
        rpActivity: 3824,
        mesureTime: new Date(2021, 5, 10, 7, 0),
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

            jest.spyOn(global.console, 'warn').mockImplementation();
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        afterEach(() => {
            jest.clearAllMocks();
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

        test('will not update if measure time in future', () => {
            const result: NowStatsType = currentStats(
                [examplePatient1, examplePatient2, examplePatient3],
                { ...exampleRpSettings, mesureTime: new Date(2021, 5, 10, 7, 10) },
            );

            expect(console.warn).toBeCalledTimes(1);
            expect(console.warn).toBeCalledWith('Measure Time is set in the Future');

            expect(result.totalVolNow).toBe(exampleRpSettings.rpVol);
            expect(result.usableVolNow).toBe(exampleRpSettings.rpVol - exampleRpSettings.unextractableVol - exampleRpSettings.wastedVol);
            expect(result.totalActivityNow).toBe(exampleRpSettings.rpActivity);
            expect(result.usableActivityNow).toBe(exampleRpSettings.rpActivity * ((exampleRpSettings.rpVol - exampleRpSettings.unextractableVol - exampleRpSettings.wastedVol) / exampleRpSettings.rpVol));
        });


        test('no change at t=0', () => {
            const result: NowStatsType = currentStats(
                [examplePatient1, examplePatient2, examplePatient3],
                { ...exampleRpSettings, mesureTime: new Date(2021, 5, 10, 7, 0) },
            );

            expect(console.warn).toBeCalledTimes(0);

            expect(result.totalVolNow).toBe(exampleRpSettings.rpVol);
            expect(result.usableVolNow).toBe(exampleRpSettings.rpVol - exampleRpSettings.unextractableVol - exampleRpSettings.wastedVol);
            expect(result.totalActivityNow).toBe(exampleRpSettings.rpActivity);
            expect(result.usableActivityNow).toBe(exampleRpSettings.rpActivity * ((exampleRpSettings.rpVol - exampleRpSettings.unextractableVol - exampleRpSettings.wastedVol) / exampleRpSettings.rpVol));
        });


    });

});