import { ICreateService } from './ICreate';
import { IDeleteService } from './IDelete';
import { IFindManyService } from './IFindMany';
import { IFindOneService } from './IFindOne';
import { IUpdateService } from './IUpdate';

export interface ICRUDService
  extends ICreateService,
    IFindManyService,
    IFindOneService,
    IUpdateService,
    IDeleteService {}
