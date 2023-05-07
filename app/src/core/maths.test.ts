import { PatientType } from '../context/PatientsContext';
import { RpSettingsType } from '../context/RpSettingsContext';
import { diffMsTimeMinutes, decay, usableActivity, activityAtFirstInj, generatePatientInjTimeList } from './maths';

describe('maths helpers', () => {

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

    describe('should correctly calculate time difference between 2 time instances', () => {
        test('difference between 2 positive time inputs', () => {
            expect(diffMsTimeMinutes(0, 0)).toBe(0);
            expect(diffMsTimeMinutes(0, 90000)).toBe(2);
            expect(diffMsTimeMinutes(1000, 2000)).toBe(0);
            expect(diffMsTimeMinutes(2000, 1000)).toBe(0);
            expect(diffMsTimeMinutes(62000, 1000)).toBe(1);
            expect(diffMsTimeMinutes(1000, 62000)).toBe(1);
            expect(diffMsTimeMinutes(0, 120000)).toBe(2);
        });
        test('difference between 2 negative time inputs', () => {
            expect(diffMsTimeMinutes(-1000, -2000)).toBe(0);
            expect(diffMsTimeMinutes(-2000, -1000)).toBe(0);
            expect(diffMsTimeMinutes(-62000, -1000)).toBe(1);
            expect(diffMsTimeMinutes(-62000, -120000)).toBe(1);
            expect(diffMsTimeMinutes(-1000, -62000)).toBe(1);
            expect(diffMsTimeMinutes(0, -120000)).toBe(2);
            expect(diffMsTimeMinutes(0, -90000)).toBe(2);
        });
        test('difference between positive and negative time inputs', () => {
            expect(diffMsTimeMinutes(1000, -2000)).toBe(0);
            expect(diffMsTimeMinutes(-1000, 2000)).toBe(0);
            expect(diffMsTimeMinutes(-2000, 1000)).toBe(0);
            expect(diffMsTimeMinutes(1000, -60000)).toBe(1);
            expect(diffMsTimeMinutes(62000, -60000)).toBe(2);
            expect(diffMsTimeMinutes(120000, -63000)).toBe(3);
            expect(diffMsTimeMinutes(120000, -90001)).toBe(4);
            expect(diffMsTimeMinutes(-90001, 120000)).toBe(4);
        });
    });

    describe('should correctly calculates radioactive decay', () => {
        test('radioactivity equales a0 at t=0', () => {
            expect(decay(3824, 109.8, 0)).toBe(3824);
        });
        test('radioactivity is decrasing', () => {
            expect(decay(3824, 109.8, 1)).toBeLessThan(decay(3824, 109.8, 0));
            expect(decay(3824, 109.8, 61)).toBeLessThan(decay(3824, 109.8, 60));
            expect(decay(3824, 109.8, 62)).toBeLessThan(decay(3824, 109.8, 60));
            expect(decay(3824, 109.8, 900)).toBeLessThan(decay(3824, 109.8, 60));
        });
        test('radioactivity is exactly half after elapsing the half life', () => {
            expect(decay(3000, 120, 120)).toBe(1500);
            expect(decay(3800, 109.8, 109.8)).toBe(1900);
            expect(decay(3824, 109.8, 109.8)).toBe(1912);
            expect(decay(3824.6, 109.8, 109.8)).toBe(1912.3);
            expect(decay(3824.1, 109.8, 109.8)).toBe(1912.05);
        });
        test('radioactivity approaches 0 as time passes', () => {
            expect(decay(3824, 109.8, 999999)).toBeLessThan(0.1);
        });
        test('shorter half life means faster decay', () => {
            const decay1 = decay(3824, 109.8, 60);
            const decay2 = decay(3824, 60, 60);
            expect(decay2).toBeLessThan(decay1);
        });
        // testing some random cases, and verifying using : https://www.omnicalculator.com/chemistry/half-life
        test('radioactivity is correctly calculated', () => {
            expect(decay(3824, 109.8, 1)).toBe(3799.935828439785);
            expect(decay(3824, 109.8, 30)).toBe(3164.238795207784);
            expect(decay(104105, 420.69, 30)).toBe(99084.26974444851);
            expect(decay(104105, 420.69, 60)).toBe(94305.6770644122);
        });
    });

    describe('should correctly calculates usable radioactivity', () => {
        test('total radioactivity constant if no volume is wasted', () => {
            expect(usableActivity(3824, 40, 0)).toBe(3824);
        });
        test('no radioactivity if all volume is wasted', () => {
            expect(usableActivity(3824, 40, 40)).toBe(0);
        });
        test('half radioactivity if half volume is wasted', () => {
            expect(usableActivity(3824, 40, 20)).toBe(1912);
        });
    });

    describe('should correctly calculates usable radioactivity when injecting the first patient', () => {
        test('we do not know injection time yet', () => {
            const rpSettings: RpSettingsType = {
                rpActivity: 3824,
                mesureTime: new Date(2021, 5, 10, 7, 0),
                rpHalfLife: 53,
                rpVol: 8.5,
                wastedVol: 0,
                unextractableVol: 0,
                labName: "Dexter's Laboratory"
            }
            expect(activityAtFirstInj([], rpSettings)).toBe(3824);
            expect(activityAtFirstInj([undefined], rpSettings)).toBe(3824);
        });
        test('throw if injected before measure', () => {
            const rpSettings: RpSettingsType = {
                rpActivity: 3824,
                mesureTime: new Date(2021, 5, 10, 7, 0),
                rpHalfLife: 53,
                rpVol: 8.5,
                wastedVol: 0,
                unextractableVol: 0,
                labName: "Dexter's Laboratory"
            }
            expect(() => activityAtFirstInj([new Date(2021, 5, 10, 6, 59).getTime()], rpSettings)).toThrowError(Error);
            expect(() => activityAtFirstInj([new Date(2021, 5, 10, 6, 0).getTime()], rpSettings)).toThrowError(Error);
            expect(() => activityAtFirstInj([new Date(2021, 5, 10, 7, 0).getTime()], rpSettings)).not.toThrowError(Error);
            expect(() => activityAtFirstInj([new Date(2021, 5, 10, 8, 0).getTime()], rpSettings)).not.toThrowError(Error);
        });
        test('injecting after half life has passed', () => {
            const rpSettings: RpSettingsType = {
                rpActivity: 3824,
                mesureTime: new Date(2021, 5, 10, 7, 0),
                rpHalfLife: 53,
                rpVol: 8.5,
                wastedVol: 0,
                unextractableVol: 0,
                labName: "Dexter's Laboratory"
            }
            expect(activityAtFirstInj([new Date(2021, 5, 10, 7, 53).getTime()], rpSettings)).toBe(1912);
        });
        test('take into account wastedVol', () => {
            const rpSettings: RpSettingsType = {
                rpActivity: 6000,
                mesureTime: new Date(2021, 5, 10, 7, 0),
                rpHalfLife: 53,
                rpVol: 6,
                wastedVol: 2,
                unextractableVol: 0,
                labName: "Dexter's Laboratory"
            }
            expect(activityAtFirstInj([new Date(2021, 5, 10, 7, 53).getTime()], rpSettings)).toBe(2000);
        });
        test('take into account unextractableVol', () => {
            const rpSettings: RpSettingsType = {
                rpActivity: 6000,
                mesureTime: new Date(2021, 5, 10, 7, 0),
                rpHalfLife: 53,
                rpVol: 6,
                wastedVol: 0,
                unextractableVol: 2,
                labName: "Dexter's Laboratory"
            }
            expect(activityAtFirstInj([new Date(2021, 5, 10, 7, 53).getTime()], rpSettings)).toBe(2000);
        });
        test('take into account wastedVol and unextractableVol combined', () => {
            const rpSettings: RpSettingsType = {
                rpActivity: 3824,
                mesureTime: new Date(2021, 5, 10, 7, 0),
                rpHalfLife: 53,
                rpVol: 6,
                wastedVol: 1.5,
                unextractableVol: 1.5,
                labName: "Dexter's Laboratory"
            }
            expect(activityAtFirstInj([new Date(2021, 5, 10, 7, 53).getTime()], rpSettings)).toBe(956);
        });
    });

    describe('should correctly generate expected injection time given a patients list', () => {
        test('does not update expected injection time of injected patients', () => {

            let patientsList: PatientType[] = [
                {
                    ...examplePatient1,
                    isInjected: true,
                    realInjectionTime: new Date(2021, 5, 10, 7, 0)
                },
                {
                    ...examplePatient2,
                    isInjected: true,
                    realInjectionTime: new Date(2021, 5, 10, 7, 45)
                },
                {
                    ...examplePatient3,
                    isInjected: true,
                    realInjectionTime: new Date(2021, 5, 10, 8, 30)
                }
            ];

            generatePatientInjTimeList(patientsList, new Date(2021, 5, 10, 7, 0), exampleRpSettings);

            patientsList.forEach((patient) => {
                expect(patient.expectedInjectionTime).toBeTruthy();
                expect(patient.expectedInjectionTime?.getTime).toBe(patient.realInjectionTime?.getTime)
            })
        });

        test('does not allow first injection to be before measure time', () => {

            const rpSettingsOverriden: RpSettingsType = {
                ...exampleRpSettings,
                mesureTime: new Date(2021, 5, 10, 6, 0)
            }

            expect(() => generatePatientInjTimeList([], new Date(2021, 5, 10, 5, 0), rpSettingsOverriden)).toThrowError(Error);
            expect(() => generatePatientInjTimeList([], new Date(2021, 5, 10, 7, 0), rpSettingsOverriden)).not.toThrowError(Error);
        });

        test('does not accept unordred list of patients', () => {
            let patientsList: PatientType[] = [
                {
                    ...examplePatient1,
                    isInjected: true,
                    realInjectionTime: new Date(2021, 5, 10, 7, 0)
                },
                {
                    ...examplePatient2,
                    isInjected: true,
                    realInjectionTime: new Date(2021, 5, 10, 7, 45)
                },
                {
                    ...examplePatient3,
                    isInjected: true,
                    realInjectionTime: new Date(2021, 5, 10, 8, 30)
                }
            ];
            expect(() => generatePatientInjTimeList(patientsList, new Date(2021, 5, 10, 7, 0), exampleRpSettings)).not.toThrowError(Error);

            patientsList[1].isInjected = false;
            expect(() => generatePatientInjTimeList(patientsList, new Date(2021, 5, 10, 7, 0), exampleRpSettings)).toThrowError(Error);

            patientsList[0].isInjected = false;
            patientsList[2].isInjected = false;
            expect(() => generatePatientInjTimeList(patientsList, new Date(2021, 5, 10, 7, 0), exampleRpSettings)).not.toThrowError(Error);
        });

        test('correctly calculate the expected inejection time', () => {
            let patientsList: PatientType[] = [
                {
                    ...examplePatient1,
                    isInjected: true,
                    realInjectionTime: new Date(2021, 5, 10, 7, 0)
                },
                {
                    ...examplePatient2,
                    isInjected: true,
                    realInjectionTime: new Date(2021, 5, 10, 7, 45)
                },
                examplePatient3
            ];

            generatePatientInjTimeList(patientsList, new Date(2021, 5, 10, 7, 0), exampleRpSettings)

            expect(patientsList[0].expectedInjectionTime).toBe(patientsList[0].realInjectionTime);
            expect(patientsList[1].expectedInjectionTime).toBe(patientsList[1].realInjectionTime);
            expect(patientsList[2].expectedInjectionTime?.getTime()).toBe(new Date((patientsList[1].realInjectionTime ?? new Date()).getTime() + patientsList[1].duration * 60000).getTime());
        });

    });
});