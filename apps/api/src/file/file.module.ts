import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { S3Service } from './s3.service';
import { FileService } from './services/file.service';
import { PlantCareFileService } from './services/plant-care-file.service';
import { PlantFileService } from './services/plant-file.service';
import { UserFileService } from './services/user-file.service';
import { SharpService } from './sharp.service';
import { PersistenceModule } from 'src/persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  controllers: [FileController],
  providers: [
    FileService,
    PlantFileService,
    PlantCareFileService,
    UserFileService,
    S3Service,
    SharpService,
    {
      provide: 'model',
      useValue: 'file',
    },
  ],
  exports: [
    FileService,
    PlantFileService,
    PlantCareFileService,
    UserFileService,
    S3Service,
    SharpService,
  ],
})
export class FileModule {}
