import { Injectable } from '@nestjs/common';
import { extname } from 'path';

const sharp = require('sharp');
@Injectable()
export class SharpService {
  constructor() {}
  public async resizeOne(
    file: Express.Multer.File,
    width: number,
    height: number,
  ): Promise<Buffer> {
    return await sharp(file.buffer)
      .resize(width, height, { fit: 'inside' })
      .toFormat(extname(file.originalname).replace('.', ''))
      .toBuffer();
  }
  public async resizeManyAndReturnBuffers(
    file: Express.Multer.File,
    scales: { width: number; height: number }[],
  ): Promise<Record<string, Buffer>[]> {
    const resizedImgBuffers = await Promise.all(
      scales.map(async ({ width, height }) => ({
        [`${width}x${height}`]: await this.resizeOne(file, width, height),
      })),
    );
    return resizedImgBuffers;
  }
}
