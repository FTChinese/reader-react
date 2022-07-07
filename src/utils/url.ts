export function queryLive(params: URLSearchParams): boolean {
  return params.get('live') === 'true';
}
