import { isAfter, isBefore, parseISO } from 'date-fns';
import { Cycle } from './enum';

enum PeriodUnit {
  Year,
  Month,
  Day,
}

const periodUnitsCN: Record<PeriodUnit, string> = {
  0: '年',
  1: '月',
  2: '天',
}

type PeriodParam = {
  count: number;
  unit: PeriodUnit
}

function formatPeriod(param: PeriodParam, recurring: boolean): string {
  const infix = (param.unit === PeriodUnit.Month)
    ? '个'
    : '';

    if (param.count === 0) {
      return ''
    }

    if (param.count === 1 && recurring) {
      return periodUnitsCN[param.unit];
    }

    return `${param.count}${infix}${periodUnitsCN[param.unit]}`;
}

export type YearMonthDay = {
  years: number;
  months: number;
  days: number;
};

export function formatPeriods(ymd: YearMonthDay, recurring: boolean): string {
  const periods: PeriodParam[] = [
    {
      count: ymd.years,
      unit: PeriodUnit.Year,
    },
    {
      count: ymd.months,
      unit: PeriodUnit.Month,
    },
    {
      count: ymd.days,
      unit: PeriodUnit.Day
    },
  ].filter(item => item.count > 0);

  switch (periods.length) {
    case 0:
      return '';

    case 1:
      return formatPeriod(periods[0], recurring);

    default:
      // If there are more than one units, you should
      // product a string linke 1年1个月; otherwise a
      // recurring price might get a string like 年月
      return periods.reduce((prev, curr) => {
        prev += formatPeriod(curr, false);

        return prev;
      }, '')
  }
}

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

export type ValidPeriod = {
  startUtc: string;
  endUtc: string;
}

export type OptionalPeriod = Partial<ValidPeriod>;

export function parsePeriod(p: ValidPeriod): TimeRange {
  return {
    startUtc: parseISO(p.startUtc),
    endUtc: parseISO(p.endUtc),
  };
}

export type TimeRange = {
  startUtc: Date;
  endUtc: Date;
}

export function isValidPeriod(p: OptionalPeriod): boolean {
  if (!p.startUtc || !p.endUtc) {
    return true;
  }

  const r = parsePeriod({
    startUtc: p.startUtc,
    endUtc: p.endUtc,
  });

  const now = new Date();

  return !isBefore(now, r.startUtc) && !isAfter(now, r.endUtc);
}


