import { isBefore, startOfDay } from 'date-fns';

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
