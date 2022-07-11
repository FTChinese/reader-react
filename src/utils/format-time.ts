import { format } from 'date-fns';

export function localizeDateTime(date: Date): string {
  return format(date, 'yyyy年M月d日H时m分s秒')
}

export function localizeDate(date: Date): string {
  return format(date, 'yyyy年M月d日');
}

export function extractDate(isoStr: string): string {
  const arr = isoStr.split('T');
  if (arr.length > 1) {
    return arr[0];
  }

  return isoStr;
}
