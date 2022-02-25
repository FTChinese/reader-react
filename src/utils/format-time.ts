import { format, parseISO } from 'date-fns';

export function localizeISO(dateString: string): string {
  return format(parseISO(dateString), 'yyyy年M月d日H时m分s秒')
}

export function extractDate(isoStr: string): string {
  const arr = isoStr.split('T');
  if (arr.length > 1) {
    return arr[0];
  }

  return isoStr;
}
