export interface IFindManyService {
  findMany(params: {
    skip?: number;
    take?: number;
    cursor?: unknown;
    where?: unknown;
    orderBy?: unknown;
  }): Promise<unknown[]>;
}
