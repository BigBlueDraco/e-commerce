import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from '../s3.service';
import { SharpService } from '../sharp.service';
import { FileService } from './file.service';

@Injectable()
export class PlantFileService extends FileService {
  constructor(
    protected prisma: PrismaService,
    @Inject(forwardRef(() => S3Service))
    protected readonly s3Service: S3Service,
    @Inject(forwardRef(() => SharpService))
    protected readonly sharpService: SharpService,
  ) {
    super(prisma, s3Service, sharpService);
  }
  async upload(file: Express.Multer.File, plantId: string) {
    const folder = `admin/uploads/plant/${plantId}`;
    const scales = [
      { width: 160, height: 160 },
      { width: 240, height: 240 },
      { width: 300, height: 300 },
    ];
    const resizedImgBuffers =
      await this.sharpService.resizeManyAndReturnBuffers(file, scales);
    const sizes = await this.uploadResizedArray(
      file,
      resizedImgBuffers,
      folder,
    );
    return await super.create({
      name: file.originalname || plantId,
      path: folder,
      original: sizes['original'],
      scales: sizes,
      isAdminContent: true,
    });
  }
  async remove(plantId: string) {
    const file = await super.findOne({ plantId });
    if (!file) {
      throw new Error('File not found for the given plant ID');
    }
    await super.removeByFile(file);
  }
}
