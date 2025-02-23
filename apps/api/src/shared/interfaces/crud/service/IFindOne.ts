export interface IFindOneService {
  findOne(whereUnique: unknown): Promise<unknown | null>;
}
