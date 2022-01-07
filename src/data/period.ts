import { Cycle } from './enum';

export type YearMonthDay = {
  years: number;
  months: number;
  days: number;
};

export function isZeroYMD(ymd: YearMonthDay): boolean {
  return ymd.years === 0 && ymd.months === 0 && ymd.days === 0;
}

export function ymdZero(): YearMonthDay {
  return {
    years: 0,
    months: 0,
    days: 0,
  };
}

export function cycleOfYMD(ymd: YearMonthDay): Cycle {
  if (ymd.years > 0) {
    return 'year';
  }

  if (ymd.months > 0) {
    return 'month';
  }

  if (ymd.days > 365) {
    return 'year';
  }

  return 'month';
}

export function totalDaysOfYMD(ymd: YearMonthDay): number {
  return ymd.years * 365 + ymd.months * 30 + ymd.days;
}

export function isYearOnly(ymd: YearMonthDay): boolean {
  return ymd.years > 0 && ymd.months == 0 && ymd.days == 0;
}

export function isMonthOnly(ymd: YearMonthDay): boolean {
  return ymd.years == 0 && ymd.months > 0 && ymd.days == 0;
}

export function isDayOnly(ymd: YearMonthDay): boolean {
  return ymd.years == 0 && ymd.months == 0 && ymd.days > 0;
}

