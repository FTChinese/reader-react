export function extractDate(isoStr: string): string {
  const arr = isoStr.split('T');
  if (arr.length > 1) {
    return arr[0];
  }

  return isoStr;
}
