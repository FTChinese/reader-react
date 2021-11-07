/**
 * @description Returns the current Unix time in seconds.
 */
 export function unixNow(): number {
  return Math.trunc(Date.now() / 1000);
}
