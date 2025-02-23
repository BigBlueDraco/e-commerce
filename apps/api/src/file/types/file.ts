import { Prisma, File as PrismaFile } from '@prisma/client';
import { Base } from 'src/shared/dtos/pagination';
export type File = PrismaFile;
export namespace File {
  export namespace Inputs {
    export type Create = Prisma.FileCreateInput;
    export type Update = Prisma.FileUpdateInput;
  }
  export namespace Args {
    export type Create = Prisma.FileCreateInput;

    export type Update = {
      where: Prisma.FileWhereInput;
      data: Prisma.FileUpdateInput;
    };

    export type FindMany = {
      cursor?: Prisma.FileWhereUniqueInput;
      where?: Prisma.FileWhereInput;
      orderBy?: Prisma.FileOrderByWithRelationInput;
    } & Base.Args.FindMany;

    export type FindOne = Prisma.FileWhereUniqueInput;

    export type Delete = Prisma.FileWhereUniqueInput;
  }
}
