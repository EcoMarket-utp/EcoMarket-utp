import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class AwsS3Service {
  private readonly logger = new Logger(AwsS3Service.name);
  private client: S3Client;

  constructor() {
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    this.client = new S3Client({
      region,
      credentials: accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined,
    });
  }

  async getUploadUrl(bucket: string, key: string, contentType = 'application/octet-stream', expiresInSeconds = 900) {
    const cmd = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType });
    try {
      const url = await getSignedUrl(this.client, cmd, { expiresIn: expiresInSeconds });
      return { url, key };
    } catch (err) {
      this.logger.error('Error generating signed URL', err as any);
      throw err;
    }
  }
}
