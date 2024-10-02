import {
  Controller,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
    @CurrentUser() user: User,
  ): Promise<User> {
    return await this.userService.update(user.id, {
      profile_picture: file.path,
    } as UpdateUserInput);
  }
}
