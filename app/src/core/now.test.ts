import { PatientType } from '../context/PatientsContext';
import { RpSettingsType } from '../context/RpSettingsContext';
import { NowStatsType } from '../context/StatisticsContext';
import { currentStats } from './now';
import { decay, diffMsTimeMinutes } from "./maths";

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

        beforeEach(() => {
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

        test('radioactivity decreases by itself', () => {
            const mockedMeasureTime = new Date(2021, 5, 10, 6, 0)
            const result: NowStatsType = currentStats(
                [examplePatient1, examplePatient2, examplePatient3],
                { ...exampleRpSettings, mesureTime: mockedMeasureTime },
            );

            const totalVolume = exampleRpSettings.rpVol;
            const usabeVolume = exampleRpSettings.rpVol - exampleRpSettings.unextractableVol - exampleRpSettings.wastedVol;
            const totalActivity = decay(
                exampleRpSettings.rpActivity,
                exampleRpSettings.rpHalfLife,
                diffMsTimeMinutes(mockedMeasureTime.getTime(), new Date().getTime())
            );

            const usableActivity = totalActivity * (usabeVolume / totalVolume)

            expect(result.totalActivityNow).toBe(totalActivity);
            expect(result.usableActivityNow).toBe(usableActivity);
            expect(result.totalVolNow).toBe(totalVolume);
            expect(result.usableVolNow).toBe(usabeVolume);
        });

        test('non injected patients are irrelevant', () => {
            const result1: NowStatsType = currentStats(
                [examplePatient1, examplePatient2, examplePatient3],
                exampleRpSettings,
            );

            const result2: NowStatsType = currentStats(
                [{ ...examplePatient1, dose: 200 }, { ...examplePatient2, dose: 1, duration: 10 }, examplePatient3],
                exampleRpSettings,
            );

            expect(result1.totalVolNow).toBe(result2.totalVolNow);
            expect(result1.usableVolNow).toBe(result2.usableVolNow);
            expect(result1.totalActivityNow).toBe(result2.totalActivityNow);
            expect(result1.usableActivityNow).toBe(result2.usableActivityNow);
        });

        test('patient injected in the future are irrelevant - 1', () => {
            const resultBeforeInjecting: NowStatsType = currentStats(
                [{ ...examplePatient1 }, { ...examplePatient2 }, { ...examplePatient3 }],
                { ...exampleRpSettings, mesureTime: new Date(2021, 5, 10, 6, 0) },
            );

            const resultAtInjecting: NowStatsType = currentStats(
                [{ ...examplePatient1, isInjected: true, realInjectionTime: new Date(new Date().getTime() + 10000) }, { ...examplePatient2 }, { ...examplePatient3 }],
                { ...exampleRpSettings, mesureTime: new Date(2021, 5, 10, 6, 0) },
            );

            expect(resultAtInjecting.totalActivityNow).toBe(resultBeforeInjecting.totalActivityNow);
            expect(resultAtInjecting.totalVolNow).toBe(resultBeforeInjecting.totalVolNow);
            expect(resultAtInjecting.usableActivityNow).toBe(resultBeforeInjecting.usableActivityNow);
            expect(resultAtInjecting.usableVolNow).toBe(resultBeforeInjecting.usableVolNow);
        });

        test('patient injected in the future are irrelevant - 2', () => {
            const resultBeforeInjecting: NowStatsType = currentStats(
                [{ ...examplePatient1 }, { ...examplePatient2 }, { ...examplePatient3 }],
                { ...exampleRpSettings, mesureTime: new Date(2021, 5, 10, 6, 0) },
            );

            const resultAtInjecting: NowStatsType = currentStats(
                [
                    {
                        ...examplePatient1,
                        isInjected: true,
                        realInjectionTime: new Date(new Date().getTime() + 10000)
                    },
                    {
                        ...examplePatient2,
                        isInjected: true,
                        realInjectionTime: new Date(new Date().getTime() + 20000)
                    },
                    {
                        ...examplePatient3
                    }
                ],
                { ...exampleRpSettings, mesureTime: new Date(2021, 5, 10, 6, 0) },
            );

            expect(resultAtInjecting.totalActivityNow).toBe(resultBeforeInjecting.totalActivityNow);
            expect(resultAtInjecting.totalVolNow).toBe(resultBeforeInjecting.totalVolNow);
            expect(resultAtInjecting.usableActivityNow).toBe(resultBeforeInjecting.usableActivityNow);
            expect(resultAtInjecting.usableVolNow).toBe(resultBeforeInjecting.usableVolNow);
        });

        test('radioactivity decreases in time - 1', () => {
            const result1: NowStatsType = currentStats(
                [{ ...examplePatient1 }, { ...examplePatient2 }, { ...examplePatient3 }],
                exampleRpSettings,
            );

            jest.setSystemTime(new Date(2021, 5, 10, 7, 10));
            const result2: NowStatsType = currentStats(
                [{ ...examplePatient1 }, { ...examplePatient2 }, { ...examplePatient3 }],
                exampleRpSettings,
            );

            expect(result2.totalVolNow).toBe(result1.totalVolNow);
            expect(result2.usableVolNow).toBe(result1.usableVolNow);

            expect(result2.totalActivityNow).toBeLessThan(result1.totalActivityNow);
            expect(result2.usableActivityNow).toBeLessThan(result1.usableActivityNow);

        });

        test('radioactivity decreases in time - 2', () => {
            const result1: NowStatsType = currentStats(
                [{ ...examplePatient1 }, { ...examplePatient2 }, { ...examplePatient3 }],
                { ...exampleRpSettings, mesureTime: new Date(2021, 5, 10, 6, 0) },
            );

            jest.setSystemTime(new Date(2021, 5, 10, 7, 10));
            const result2: NowStatsType = currentStats(
                [{ ...examplePatient1 }, { ...examplePatient2 }, { ...examplePatient3 }],
                { ...exampleRpSettings, mesureTime: new Date(2021, 5, 10, 6, 0) },
            );

            expect(result2.totalVolNow).toBe(result1.totalVolNow);
            expect(result2.usableVolNow).toBe(result1.usableVolNow);

            expect(result2.totalActivityNow).toBeLessThan(result1.totalActivityNow);
            expect(result2.usableActivityNow).toBeLessThan(result1.usableActivityNow);

        });

        test('injecting sooner leads to more remaining radioactivity', () => {
            const result1: NowStatsType = currentStats(
                [{ ...examplePatient1, isInjected: true, realInjectionTime: new Date(2021, 5, 10, 6, 0), realInjectionVolume: 1 }, { ...examplePatient2 }, { ...examplePatient3 }],
                { ...exampleRpSettings, mesureTime: new Date(2021, 5, 10, 6, 0) },
            );

            const result2: NowStatsType = currentStats(
                [{ ...examplePatient1, isInjected: true, realInjectionTime: new Date(2021, 5, 10, 6, 10), realInjectionVolume: 1 }, { ...examplePatient2 }, { ...examplePatient3 }],
                { ...exampleRpSettings, mesureTime: new Date(2021, 5, 10, 6, 0) },
            );

            expect(result2.totalVolNow).toBe(result1.totalVolNow);
            expect(result2.usableVolNow).toBe(result1.usableVolNow);

            expect(result2.totalActivityNow).toBeLessThan(result1.totalActivityNow);
            expect(result2.usableActivityNow).toBeLessThan(result1.usableActivityNow);

        });

        test('test case 1', () => {
            const resultBeforeInjecting: NowStatsType = currentStats(
                [{ ...examplePatient1 }, { ...examplePatient2 }, { ...examplePatient3 }],
                { ...exampleRpSettings, mesureTime: new Date(2021, 5, 10, 6, 0) },
            );

            const patientDose = 100;
            const patientVol = 1;

            const resultAtInjecting: NowStatsType = currentStats(
                [{ ...examplePatient1, isInjected: true, dose: patientDose, realInjectionVolume: patientVol, realInjectionTime: new Date() }, { ...examplePatient2 }, { ...examplePatient3 }],
                { ...exampleRpSettings, mesureTime: new Date(2021, 5, 10, 6, 0) },
            );

            expect(resultAtInjecting.totalActivityNow).toBe(resultBeforeInjecting.totalActivityNow - patientDose);
            expect(resultAtInjecting.totalVolNow).toBe(resultBeforeInjecting.totalVolNow - patientVol);
            expect(resultAtInjecting.usableActivityNow).toBe(resultBeforeInjecting.usableActivityNow - patientDose);
            expect(resultAtInjecting.usableVolNow).toBe(resultBeforeInjecting.usableVolNow - patientVol);
        });

        test('test case 2', () => {

            const patientDose = 100;
            const patientVol = 0.5;

            // the state right at the measure time
            jest.setSystemTime(new Date(2021, 5, 10, 7, 0));
            const result1: NowStatsType = currentStats(
                [{ ...examplePatient1 }, { ...examplePatient2 }, { ...examplePatient3 }],
                exampleRpSettings,
            );

            // the state after passing 10min
            jest.setSystemTime(new Date(2021, 5, 10, 7, 10));
            const result2: NowStatsType = currentStats(
                [{ ...examplePatient1 }, { ...examplePatient2 }, { ...examplePatient3 }],
                exampleRpSettings,
            );

            // the state when injecting a patient at 10min
            const result3: NowStatsType = currentStats(
                [{ ...examplePatient1, isInjected: true, dose: patientDose, realInjectionVolume: patientVol, realInjectionTime: new Date(2021, 5, 10, 7, 10) }, { ...examplePatient2 }, { ...examplePatient3 }],
                exampleRpSettings,
            );


            // the state after passing 20min and injecting a patient at 10min
            jest.setSystemTime(new Date(2021, 5, 10, 7, 20));
            const result4: NowStatsType = currentStats(
                [{ ...examplePatient1, isInjected: true, dose: patientDose, realInjectionVolume: patientVol, realInjectionTime: new Date(2021, 5, 10, 7, 10) }, { ...examplePatient2 }, { ...examplePatient3 }],
                exampleRpSettings,
            );

            expect(result1.totalVolNow).toBe(result2.totalVolNow);
            expect(result1.usableVolNow).toBe(result2.usableVolNow);

            expect(result3.totalVolNow).toBe(result4.totalVolNow);
            expect(result3.usableVolNow).toBe(result4.usableVolNow);

            expect(result4.totalVolNow).toBeLessThan(result1.totalVolNow);
            expect(result4.usableVolNow).toBeLessThan(result1.usableVolNow);

            expect(result4.totalActivityNow).toBeLessThan(result3.totalActivityNow);
            expect(result3.totalActivityNow).toBeLessThan(result2.totalActivityNow);
            expect(result2.totalActivityNow).toBeLessThan(result1.totalActivityNow);

            expect(result4.usableActivityNow).toBeLessThan(result3.usableActivityNow);
            expect(result3.usableActivityNow).toBeLessThan(result2.usableActivityNow);
            expect(result2.usableActivityNow).toBeLessThan(result1.usableActivityNow);

        });

    });

});