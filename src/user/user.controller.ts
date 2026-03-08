import { 
  Controller, Post, Body, Get, Query, Param, Delete, UseInterceptors, UploadedFile 
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { extname } from 'path';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Post('signup')
  createAccount(@Body() data: UserDTO) {
    return this.userService.createAccount(data);
  }


  @Get('search')
  findByName(@Query('name') name: string) {
    return this.userService.findByNameSubstring(name);
  }

  
  @Get('profile/:username')
  getProfile(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }

 
 @Delete('remove/:username')
removeUser(@Param('username') username: string) {
  
  return this.userService.removeByUsername(username);
}


  @Post('upload-document')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/^.*\.(pdf)$/)) cb(null, true);
      else cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'pdf'), false);
    },
    limits: { fileSize: 2000000 }, 
    storage: diskStorage({
      destination: './uploads/docs',
      filename: (req, file, cb) => {
        cb(null, Date.now() + extname(file.originalname));
      },
    }),
  }))
  uploadDocument(@UploadedFile() file: Express.Multer.File) {
    return this.userService.uploadDocument(file.filename);
  }
}
