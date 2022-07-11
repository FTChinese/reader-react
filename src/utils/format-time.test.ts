import { extractDate } from './format-time';

it('Extract date part from iso datetime', () => {
  expect(extractDate('2021-11-04T18:55:55Z')).toBe('2021-11-04');
});
