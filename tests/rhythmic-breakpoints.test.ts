import * as mediaQueryManager from '../src';

describe('rhythmic-breakpoints', () => {
    it('Has Correct API', () => {
        const keys = Object.keys(mediaQueryManager);
        expect(keys.length).toBe(3);
        expect(keys).toMatchSnapshot();
    });
});
