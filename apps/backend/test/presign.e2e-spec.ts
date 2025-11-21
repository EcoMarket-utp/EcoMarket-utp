import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AwsS3Service } from '../src/aws/aws-s3.service';
import * as http from 'http';

describe('Presigned upload flow (e2e)', () => {
  let app: INestApplication;
  let server: http.Server;
  let received = false;
  let serverPort: number;

  beforeAll(async () => {
    // Start a local http server that will accept the PUT to the presigned URL
    server = http.createServer((req, res) => {
      if (req.method === 'PUT' && req.url && req.url.startsWith('/upload/')) {
        received = true;
        // drain body
        req.on('data', () => {});
        req.on('end', () => {
          res.writeHead(200);
          res.end('ok');
        });
      } else if (req.method === 'GET') {
        res.writeHead(200);
        res.end('ok');
      } else {
        res.writeHead(404);
        res.end();
      }
    });
    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        // @ts-ignore
        serverPort = (server.address() as any).port;
        resolve();
      });
    });

    const mockAws: Partial<AwsS3Service> = {
      async getUploadUrl(bucket: string, key: string, _contentType = 'application/octet-stream', expiresInSeconds = 900) {
        const url = `http://127.0.0.1:${serverPort}/upload/${key}`;
        const publicUrl = `http://127.0.0.1:${serverPort}/public/${key}`;
        return { url, key, publicUrl, expiresIn: expiresInSeconds } as any;
      },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(AwsS3Service)
      .useValue(mockAws)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('/products/upload-url (POST) should return signed url + publicUrl + expiresIn', async () => {
    const body = { filename: 'test.jpg', contentType: 'image/jpeg' };
    const res = await request(app.getHttpServer()).post('/products/upload-url').send(body).expect(201).orFail();
    expect(res.body).toHaveProperty('url');
    expect(res.body).toHaveProperty('key');
    expect(res.body).toHaveProperty('publicUrl');
    expect(res.body).toHaveProperty('expiresIn');
  });

  it('should be able to PUT to the presigned URL and server receives the upload', async () => {
    const body = { filename: 'upload2.jpg', contentType: 'image/jpeg' };
    const res = await request(app.getHttpServer()).post('/products/upload-url').send(body).expect(201).orFail();
    const signedUrl = res.body.url as string;

    // Perform a PUT to the returned URL
    const putRes = await fetch(signedUrl, { method: 'PUT', body: 'hello', headers: { 'Content-Type': 'image/jpeg' } });
    expect(putRes.status).toBe(200);
    expect(received).toBe(true);
  });
});
