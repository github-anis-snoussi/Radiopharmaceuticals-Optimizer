import { PatientType } from '../context/PatientsContext';
import { RpSettingsType } from '../context/RpSettingsContext';
import { FutureStatsType } from '../context/StatisticsContext';
import { usableActivity } from './maths';
import { predict } from './predict';

describe('prediction algorithms helpers', () => {

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

    describe('should correctly predict the finish state of the system', () => {
        test('will always output prediction', () => {
            const result: FutureStatsType = predict(
                [examplePatient1, examplePatient2, examplePatient3],
                exampleRpSettings,
                new Date(2021, 5, 10, 7, 45),
            );
            expect(result.remainingActivityTime).toBeDefined();
            expect(result.totalExpectedInjectedPatients).toBeDefined();
            expect(result.totalRemainingActivity).toBeDefined();
            expect(result.usableRemainingActivity).toBeDefined();
            expect(result.totalRemainingVol).toBeDefined();
            expect(result.usableRemainingVol).toBeDefined();
        });

        test('will return measure values if no patients are added', () => {
            const result: FutureStatsType = predict(
                [],
                exampleRpSettings,
            );
            expect(result.totalExpectedInjectedPatients).toBe(0);
            expect(result.remainingActivityTime).toBe(exampleRpSettings.mesureTime);
            expect(result.totalRemainingActivity).toBe(exampleRpSettings.rpActivity);
            expect(result.usableRemainingActivity).toBe(usableActivity(exampleRpSettings.rpActivity, exampleRpSettings.rpVol, exampleRpSettings.unextractableVol + exampleRpSettings.wastedVol));
            expect(result.totalRemainingVol).toBe(exampleRpSettings.rpVol);
            expect(result.usableRemainingVol).toBe(exampleRpSettings.rpVol - exampleRpSettings.unextractableVol - exampleRpSettings.wastedVol);
        });

        test('stops once a patient is not injectable - 1', () => {
            const result: FutureStatsType = predict(
                [{ ...examplePatient1, dose: 4000 }, examplePatient2, examplePatient3],
                exampleRpSettings,
                new Date(2021, 5, 10, 7, 45),
            );
            expect(result.totalExpectedInjectedPatients).toBeDefined();
            expect(result.totalExpectedInjectedPatients).toBe(0);
        });

        test('stops once a patient is not injectable - 2', () => {
            const result: FutureStatsType = predict(
                [examplePatient1, { ...examplePatient2, dose: 4000 }, examplePatient3],
                exampleRpSettings,
                new Date(2021, 5, 10, 7, 45),
            );
            expect(result.totalExpectedInjectedPatients).toBeDefined();
            expect(result.totalExpectedInjectedPatients).toBe(1);
        });

    });

});