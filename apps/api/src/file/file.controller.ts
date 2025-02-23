import { Controller, forwardRef, Inject } from '@nestjs/common';
import { FileService } from './services/file.service';

@Controller('file')
export class FileController {
  constructor(
    @Inject(forwardRef(() => FileService)) private fileService: FileService,
  ) {}
}
