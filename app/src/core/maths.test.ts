import { diffMsTimeMinutes } from './maths';

describe('maths helpers', () => {
    describe('diffMsTimeMinutes function', () => {
        test('diff positive numbers', () => {
            expect(diffMsTimeMinutes(1000, 2000)).toBe(0);
            expect(diffMsTimeMinutes(2000, 1000)).toBe(0);
            expect(diffMsTimeMinutes(62000, 1000)).toBe(1);
            expect(diffMsTimeMinutes(1000, 62000)).toBe(1);
        });
    });
});