import { Auth } from '@plant-care/types';

export interface IAuth {
  signup(body: unknown): Promise<Auth.Response>;
  login(body: unknown): Promise<Auth.Response>;
}
