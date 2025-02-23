import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ICRUDService } from '../interfaces/crud/service/ICRUD';
import { BasePrismaCrudService } from './BasePrismaCrudService';
import { FileService } from 'src/file/services/file.service';

@Injectable()
export class BasePrismaCrudWithFileService<
    T extends { id: string },
    Create,
    FindMany,
    FindOne extends { id?: string },
    Delete extends { id?: string },
    Update,
  >
  extends BasePrismaCrudService<T, Create, FindMany, FindOne, Delete, Update>
  implements ICRUDService
{
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly fileService: FileService,
    @Inject('model') recourse: string,
  ) {
    super(prisma, recourse);
  }
  async delete(where: Delete): Promise<T> {
    try {
      const entity = await super.findOne(where as unknown as FindOne);
      if (!entity) {
        throw new Error(`${this.recourse} not found`);
      }
      await this.fileService.remove(entity.id);
      return await super.delete(where);
    } catch (error) {
      throw new Error(`Failed to delete ${this.recourse}: ${error.message}`);
    }
  }
  async upload(file: Express.Multer.File, ...args: any) {
    try {
      this.fileService.upload(file, ...args);
    } catch (err) {
      console.log(err);
      throw new Error(`Failed to upload file: ${err.message}`);
    }
  }
}
