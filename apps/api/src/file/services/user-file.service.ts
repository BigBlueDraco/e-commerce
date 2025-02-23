import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from '../s3.service';
import { SharpService } from '../sharp.service';
import { FileService } from './file.service';

@Injectable()
export class UserFileService extends FileService {
  constructor(
    protected prisma: PrismaService,
    @Inject(forwardRef(() => S3Service))
    protected readonly s3Service: S3Service,
    @Inject(forwardRef(() => SharpService))
    protected readonly sharpService: SharpService,
  ) {
    super(prisma, s3Service, sharpService);
  }
  async upload(file: Express.Multer.File, userId: string) {
    const folder = `user/uploads/${userId}/avatar/`;
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
      isAvatar: true,
      avatarUser: { connect: { id: userId } },
      user: { connect: { id: userId } },
    });
  }
  async remove(userId: string) {
    const files = await super.prisma.file.findMany({
      where: {
        AND: [
          {
            OR: [
              { avatarUser: { every: { id: userId } } },
              { user: { id: userId } },
            ],
          },
          { isAdminContent: false },
        ],
      },
    });
    if (!files) {
      return null;
    }
    await Promise.all(files.map(async (file) => await this.removeByFile(file)));
  }
}
