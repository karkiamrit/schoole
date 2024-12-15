import {
  Controller,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserService } from '@/user/user.service';
import { CurrentUser } from '@/modules/decorators/user.decorator';
import { User } from '@/user/entities/user.entity';
import { UpdateUserInput } from '@/user/inputs/user.input';
import { GraphqlPassportAuthGuard } from '@/modules/guards/graphql-passport-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('/profile-picture')
  @UseGuards(new GraphqlPassportAuthGuard())
  @UseInterceptors(
    FileInterceptor('profile-picture', {
      storage: diskStorage({
        destination: './uploads', // specify the path where the files should be saved
        filename: (req, file, callback) => {
          const name = Date.now() + extname(file.originalname); // generate a unique filename
          callback(null, name);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|JPG)$/)) {
          return callback(
            new HttpException(
              'Only image files (jpg, jpeg, png, gif, webp) are allowed!',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ): Promise<User> {
    return await this.userService.update(user.id, {
      profile_picture: file.path,
    } as UpdateUserInput);
  }
}
