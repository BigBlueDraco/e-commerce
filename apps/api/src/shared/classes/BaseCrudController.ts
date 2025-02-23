import { BasePrismaCrudService } from './BasePrismaCrudService';
import { Pagination } from './pagination';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FindManyDto } from '../dtos/pagination';

export class BaseCrudController<
  T,
  Create,
  IdPathParams extends { id: string },
  UpdateBody,
> {
  constructor(
    private readonly baseCrudService: BasePrismaCrudService<
      T,
      unknown,
      unknown,
      unknown,
      unknown,
      unknown
    >,
  ) {}
  async create(createPlantDto: Create): Promise<T> {
    try {
      return await this.baseCrudService.create(createPlantDto);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create resource',
        error,
      );
    }
  }

  async findAll(body: FindManyDto): Promise<Pagination<T>> {
    try {
      const count = await this.baseCrudService.count();

      const data = await this.baseCrudService.findMany({
        skip: (body.page - 1) * body.perPage || 0,
        take: +body.perPage || 20,
        orderBy:
          body.orderBy && body.order
            ? {
                [body.orderBy]: body.order,
              }
            : { id: 'asc' },
      });
      return new Pagination<T>(data, count, body.perPage || 20, body.page || 1);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve resources',
        error,
      );
    }
  }

  async findOne(params: IdPathParams): Promise<T> {
    try {
      const result = await this.baseCrudService.findOne({ id: +params.id });
      if (!result) {
        throw new NotFoundException(`Resource with id ${params.id} not found`);
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to retrieve resource',
        error,
      );
    }
  }

  async update(params: IdPathParams, updatePlantDto: UpdateBody): Promise<T> {
    try {
      const result = await this.baseCrudService.update({
        where: { id: params.id },
        data: updatePlantDto,
      });
      if (!result) {
        throw new NotFoundException(`Resource with id ${params.id} not found`);
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to update resource',
        error,
      );
    }
  }

  async delete(params: IdPathParams): Promise<T> {
    try {
      const result = await this.baseCrudService.delete({ id: params?.id });
      if (!result) {
        throw new NotFoundException(`Resource with id ${params.id} not found`);
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to delete resource',
        error,
      );
    }
  }
}
