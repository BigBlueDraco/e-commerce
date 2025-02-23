import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ICRUDService } from '../interfaces/crud/service/ICRUD';

@Injectable()
export class BasePrismaCrudService<
  T,
  Create,
  FindMany,
  FindOne extends { id?: string },
  Delete extends { id?: string },
  Update,
> implements ICRUDService
{
  recourse: string;
  constructor(
    protected readonly prisma: PrismaService,
    @Inject('model') recourse: string,
  ) {
    this.recourse = recourse;
  }
  async count(): Promise<number> {
    return await this.prisma[this.recourse].count();
  }
  async findOne(userWhereUniqueInput: FindOne): Promise<T | null> {
    return this.prisma[this.recourse].findUnique({
      where: userWhereUniqueInput,
    });
  }
  async findMany(params: FindMany): Promise<T[]> {
    return this.prisma[this.recourse].findMany(params);
  }

  async create(data: Create): Promise<T> {
    return this.prisma[this.recourse].create({
      data,
    });
  }

  async update(params: Update): Promise<T> {
    return this.prisma[this.recourse].update(params);
  }

  async delete(where: Delete): Promise<T> {
    return this.prisma[this.recourse].delete({
      where,
    });
  }
}
