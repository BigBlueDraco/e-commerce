export interface ICreateService {
  create(data: unknown): Promise<unknown>;
}
