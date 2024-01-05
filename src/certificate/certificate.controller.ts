import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CertificateService } from './certificate.service';

@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const transactionId = await this.certificateService.uploadFile(file);
    return { transactionId };
  }

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFile(
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
  //         new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
  //       ],
  //     }),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   console.log(file);
  // }

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   const title = 'Title for REST certificate creation'; // Define your title here

  //   try {
  //     const certificate =
  //       await this.certificateService.uploadFileAndCreateCertificate(
  //         file,
  //         title,
  //       );
  //     // Handle successful creation response
  //     return { success: true, certificate };
  //   } catch (error) {
  //     // Handle error during transaction
  //     return {
  //       success: false,
  //       error: 'Failed to upload and create certificate.',
  //     };
  //   }
  // }
}
