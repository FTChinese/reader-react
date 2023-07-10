import { differenceInDays, differenceInYears, isBefore, startOfDay } from 'date-fns';

/**
 * @description Returns the current Unix time in seconds.
 */
 export function unixNow(): number {
  return Math.trunc(Date.now() / 1000);
}

export function isExpired(date: Date): boolean {
  const today = startOfDay(new Date());
  return isBefore(date, today);
}

export function diffToday(date: Date): number {
  const today = startOfDay(new Date());
  return differenceInDays(date, today);
}

/**
 * @see https://date-fns.org/v2.28.0/docs/differenceInYears
 */
export function isExceedingYear(date: Date, count: number): boolean {
  return differenceInYears(date, new Date()) > count;
}
