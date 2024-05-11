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
import { EventService } from './event.service';
import { UpdateEventInput } from './inputs/event.input';

@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventService) {}

  //   @Post('uploadBanner')
  //   @UseInterceptors(FileInterceptor('banner'))
  //   async uploadBanner(@UploadedFile() file: Express.Multer.File) {
  //     const bannerId = await this.fileUploadService.upload(file);
  //     return { bannerId };
  //   } @Post()

  @Put('/event-banner')
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
    @Body('eventId') eventId: number,
  ) {
    return await this.eventService.update(eventId, {
      banner: file.path,
    } as UpdateEventInput);
  }
}
