export interface PagedList<T> {
  total: number;
  page: number;
  limit: number;
  data: T[];
}

export interface PagingParams {
  currentPage: number;
  itemsPerPage: number;
}

export function pagingToQuery(p: PagingParams): URLSearchParams {
  const params = new URLSearchParams();
  params.set('page', p.currentPage.toFixed());
  params.set('per_page', p.itemsPerPage.toFixed())

  return params;
}
