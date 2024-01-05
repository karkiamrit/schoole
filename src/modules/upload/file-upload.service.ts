import { Injectable } from '@nestjs/common';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
  async upload(file: Express.Multer.File): Promise<string> {
    const uploadDirectory = './uploads'; // Directory to store uploaded files

    // Create the directory if it doesn't exist
    if (!existsSync(uploadDirectory)) {
      mkdirSync(uploadDirectory, { recursive: true });
    }

    const fileExtension = extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = `${uploadDirectory}/${fileName}`;

    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(filePath);
      writeStream.on('finish', () => resolve(filePath));
      writeStream.on('error', (error) => reject(error));
      writeStream.write(file.buffer);
      writeStream.end();
    });
  }
}
