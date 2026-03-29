import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadsController } from './uploads.controller';

@Module({
  imports: [MulterModule.register({ storage: memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })],
  controllers: [UploadsController],
})
export class UploadsModule {}
