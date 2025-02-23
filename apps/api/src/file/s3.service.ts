import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SharpService } from './sharp.service';

const sharp = require('sharp');
@Injectable()
export class S3Service {
  client: S3Client;
  bucketName: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly sharpService: SharpService,
  ) {
    this.bucketName = configService.get<string>('S3_BUCKET_NAME');
    this.client = new S3Client({
      endpoint:
        configService.get('NODE_ENV') === 'development' &&
        'http://localhost:9000',
      region: configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: configService.get<string>('S3_ACCESS_KEY'),
        secretAccessKey: configService.get<string>('S3_SECRET_KEY'),
      },
      forcePathStyle: true,
    });
  }
  private getFileUrlByKey(filename: string) {
    return this.configService.get('NODE_ENV') === 'development'
      ? `http://localhost:9000/${this.bucketName}/${filename}`
      : `https://${this.bucketName}.${this.configService.get<string>(
          'AWS_REGION',
        )}.s3.amazonaws.com/${filename}`;
  }
  async upload(buffer: Buffer, key: string, mimetype) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    });
    try {
      await this.client.send(command);
      return this.getFileUrlByKey(key);
    } catch (err) {
      console.error(err);
      throw new Error("Can't save file from storage");
    }
  }
  async uploadMany(data: { buffer: Buffer; key: string; mimetype: string }[]) {
    return Promise.all(
      data.map(({ buffer, key, mimetype }, index) =>
        this.upload(buffer, key, mimetype),
      ),
    );
  }
  async remove(key) {
    try {
      const command = new DeleteObjectCommand({
        Key: key,
        Bucket: this.bucketName,
      });
      await this.client.send(command);
    } catch (err) {
      throw new Error('Can`t delete file from storage');
    }
  }
}
