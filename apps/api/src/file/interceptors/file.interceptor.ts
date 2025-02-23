import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { extname } from 'path';

@Injectable()
export class CustomFileInterceptor implements NestInterceptor {
  private fileInterceptor: NestInterceptor;

  constructor() {
    const multerOptions: MulterOptions = {
      fileFilter: (req, file, callback) => {
        if (file.fieldname !== 'file') {
          return callback(new BadRequestException('Invalid field name'), false);
        }

        const ext = extname(file.originalname).toLowerCase();
        if (!['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) {
          return callback(new BadRequestException('Invalid file type'), false);
        }

        const fileSize = parseInt(req.headers['content-length']);
        if (fileSize > 500 * 1024) {
          // 500kb
          return callback(new BadRequestException('File too large'), false);
        }

        callback(null, true);
      },
      limits: {
        fileSize: 500 * 1024, // 500kb
      },
    };

    this.fileInterceptor = new (FileInterceptor('file', multerOptions))();
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    return await this.fileInterceptor.intercept(context, next);
  }
}
