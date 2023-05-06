import { PatientType } from '../context/PatientsContext';
import { RpSettingsType } from '../context/RpSettingsContext';
import { FutureStatsType } from '../context/StatisticsContext';
import { predict } from './predict';

describe('prediction algorithms helpers', () => {

    const exampleRpSettings: RpSettingsType = {
        rpActivity: 3824,
        mesureTime: new Date(2021, 5, 10, 6, 0),
        rpHalfLife: 53,
        rpVol: 8.5,
        wastedVol: 0,
        unextractableVol: 0,
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
        test('should output prediction', () => {
            const result: FutureStatsType = predict(
                [examplePatient1, examplePatient2, examplePatient3],
                exampleRpSettings,
                new Date(2021, 5, 10, 7, 45),
            )

            expect(result.remainingActivityTime).toBeTruthy();
            expect(result.totalExpectedInjectedPatients).toBeTruthy();
            expect(result.totalRemainingActivity).toBeTruthy();
            expect(result.usableRemainingActivity).toBeTruthy();
            expect(result.totalRemainingVol).toBeTruthy();
            expect(result.usableRemainingVol).toBeTruthy();
        });

    });

});