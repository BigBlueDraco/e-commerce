export interface IDeleteService {
  delete(where: unknown): Promise<unknown>;
}
