import { CurrentUser } from '@/modules/decorators/user.decorator';
import { FileUploadService } from '@/modules/upload/file-upload.service';
import {
  Body,
  Controller,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SubEventService } from './subEvent.service';
import { UpdateSubEventInput } from './inputs/subEvent.input';

@Controller('sub-events')
export class SubEventsController {
  constructor(private readonly SubEventService: SubEventService) {}

  @Put('/banner')
  @UseInterceptors(
    FileInterceptor('banner', {
      storage: diskStorage({
        destination: './uploads', // specify the path where the files should be saved
        filename: (req, file, callback) => {
          const name = Date.now() + extname(file.originalname); // generate a unique filename
          callback(null, name);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Only accept images
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          // Reject file
          return callback(new Error('Only image files are allowed!'), false);
        }
        // Accept file
        callback(null, true);
      },
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body('SubEventId') SubEventId: number,
  ) {
    await this.SubEventService.update(SubEventId, {
      banner: file.path,
    } as UpdateSubEventInput);
  }
}
