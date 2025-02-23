import { Base } from '@plant-care/types/dist/base';

export class Pagination<T> implements Base.PaginationResponse {
  data: T[];
  meta: Base.PaginationMeta;
  constructor(data: T[], count: number, perPage: number, page: number) {
    const lastPage = count / perPage;
    this.data = [...data];
    this.meta = {
      total: count,
      lastPage: Math.ceil(lastPage),
      currentPage: +page,
      perPage: +perPage,
      prev: +page - 1 || null,
      next: Math.ceil(lastPage) !== page ? +page + 1 : null,
    };
  }
}
