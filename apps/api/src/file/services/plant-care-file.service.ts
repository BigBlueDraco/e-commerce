import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from '../s3.service';
import { SharpService } from '../sharp.service';
import { FileService } from './file.service';

@Injectable()
export class PlantCareFileService extends FileService {
  constructor(
    protected prisma: PrismaService,
    @Inject(forwardRef(() => S3Service))
    protected readonly s3Service: S3Service,
    @Inject(forwardRef(() => SharpService))
    protected readonly sharpService: SharpService,
  ) {
    super(prisma, s3Service, sharpService);
  }
  async upload(file: Express.Multer.File, userId: string, plantCareId: string) {
    const folder = `user/uploads/${userId}/plant-care/${plantCareId}`;
    const scales = [
      { width: 40, height: 40 },
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
      name: file.originalname || userId,
      path: folder,
      original: sizes['original'],
      scales: sizes,
      isPlantContent: true,
      user: { connect: { id: userId } },
      userPlantCare: { connect: { id: plantCareId } },
    });
  }
  async remove(userPlantCareId: string) {
    const file = await super.findOne({ userPlantCareId });
    if (!file) {
      throw new Error('File not found for the given plant ID');
    }
    await super.removeByFile(file);
  }
}
