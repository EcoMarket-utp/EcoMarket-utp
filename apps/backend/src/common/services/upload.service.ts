import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Multer } from 'multer';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly uploadDir = join(process.cwd(), 'public', 'uploads');
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

  constructor() {
    // Crear directorio si no existe
    try {
      mkdirSync(this.uploadDir, { recursive: true });
    } catch (error) {
      this.logger.error(`Error creating upload directory: ${error.message}`);
    }
  }

  /**
   * Subir un archivo y guardar localmente
   */
  async uploadFile(file: Multer.File): Promise<{
    url: string;
    filename: string;
    size: number;
  }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validar tamaño
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum of ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }

    // Validar tipo de archivo (solo imágenes)
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only image files are allowed');
    }

    try {
      // Generar nombre único
      const ext = file.originalname.split('.').pop();
      const filename = `${uuidv4()}.${ext}`;
      const filepath = join(this.uploadDir, filename);

      // Guardar archivo
      writeFileSync(filepath, file.buffer);

      // Retornar URL relativa
      const url = `/uploads/${filename}`;

      this.logger.log(`File uploaded successfully: ${filename}`);

      return {
        url,
        filename,
        size: file.size,
      };
    } catch (error) {
      this.logger.error(`Error uploading file: ${error.message}`);
      throw new BadRequestException('Error uploading file');
    }
  }

  /**
   * Subir múltiples archivos
   */
  async uploadMultipleFiles(
    files: Multer.File[],
  ): Promise<
    Array<{
      url: string;
      filename: string;
      size: number;
    }>
  > {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadedFiles: Array<{
      url: string;
      filename: string;
      size: number;
    }> = [];
    for (const file of files) {
      const result = await this.uploadFile(file);
      uploadedFiles.push(result);
    }

    return uploadedFiles;
  }
}
