export function queryLive(params: URLSearchParams): boolean {
  if (!params.has('test')) {
    return true;
  }

  return params.get('test') !== 'true';
}
