import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
  UseInterceptors, 
  UploadedFile
  
} from '@nestjs/common';
import { UserService } from './user.service';
 import { UserDTO} from './user.dto';
 import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { extname } from 'path';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
 
  @Get('search-service')
  searchService(@Query('name') name: string): object {
    return this.userService.searchService(name);
  }
 
  @Post('signup')
  createAccount(@Body() data: UserDTO): object {
    return this.userService.createAccount(data);
  }
 
  @Put('update-profile/:id')
  updateProfile(@Param('id', ParseIntPipe) id: number, @Body() info: UserDTO): object {
    return this.userService.updateProfile(id, info);
  }

  @Post('upload-document')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/^.*\.(pdf)$/)) 
        cb(null, true);
      else
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'pdf'), false);
    },
    limits: { fileSize: 2000000 }, 
    storage: diskStorage({
      destination: './uploads/docs',
      filename: (req, file, cb) => {
        cb(null, Date.now() + extname(file.originalname));
      },
    }),
  }))
  uploadDocument(@UploadedFile() file: Express.Multer.File): object {
    return this.userService.uploadDocument(file.filename);
  }
 
  @Post('add-to-cart')
  addToCart(@Body() cartData: object): object {
    return this.userService.addToCart(cartData);
  }
 
  @Delete('cancel-service/:id')
  cancelService(@Param('id') id: number): object {
    return this.userService.cancelService(id);
  }
}