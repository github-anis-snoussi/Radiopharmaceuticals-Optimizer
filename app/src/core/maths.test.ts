import { diffMsTimeMinutes, decay, usableActivity } from './maths';

describe('maths helpers', () => {
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
});