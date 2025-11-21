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
      // Build a public URL for direct access (best-effort, depends on region and bucket settings)
      const region = process.env.AWS_REGION || '';
      const publicUrl = bucket && region ? `https://${bucket}.s3.${region}.amazonaws.com/${key}` : `https://${bucket}.s3.amazonaws.com/${key}`;
      return { url, key, publicUrl, expiresIn: expiresInSeconds };
    } catch (err) {
      this.logger.error('Error generating signed URL', err as any);
      throw err;
    }
  }
}
