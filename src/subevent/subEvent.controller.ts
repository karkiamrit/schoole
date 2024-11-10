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
import { UpdateSubEventInput } from './inputs/subEvent.input';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SubEventService } from '@/subevent/subEvent.service';
import { SubEvent } from '@/subevent/entities/subEvent.entity';

@Controller('sub-events')
export class SubEventsController {
  constructor(private readonly SubEventService: SubEventService) {}

  @Put('/upload')
  @UseInterceptors(
    FileInterceptor('upload', {
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
    @Body('eventId') eventId: number,
    @Body('type') type: 'banner' | 'displayPicture',
  ): Promise<SubEvent> {
    if (type == 'banner') {
      return await this.SubEventService.update(eventId, {
        banner: file.path,
      } as UpdateSubEventInput);
    } else {
      return await this.SubEventService.update(eventId, {
        displayPicture: file.path,
      } as UpdateSubEventInput);
    }
  }
}
