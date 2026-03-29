import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class StorageService implements OnModuleInit {
  private client: S3Client;
  private bucket: string;
  private publicUrl: string;

  onModuleInit() {
    this.bucket = process.env.STORAGE_BUCKET ?? 'skillity';
    const endpoint = process.env.STORAGE_ENDPOINT ?? 'http://localhost:9000';
    this.publicUrl = process.env.STORAGE_PUBLIC_URL ?? endpoint;

    this.client = new S3Client({
      endpoint,
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.STORAGE_ACCESS_KEY ?? 'dev_user',
        secretAccessKey: process.env.STORAGE_SECRET_KEY ?? 'dev_pass',
      },
      forcePathStyle: true,
    });
  }

  async upload(
    buffer: Buffer,
    key: string,
    mimeType: string,
  ): Promise<string> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      }),
    );
    return `${this.publicUrl}/${this.bucket}/${key}`;
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }
}
