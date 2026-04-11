import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from './auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('search-service')
  searchService(@Query('name') name: string): object {
    return this.userService.searchService(name);
  }

  @Post('signup')
  createAccount(@Body() data: UserDTO): object {
    return this.userService.createAccount(data);
  }

  @Post('signin')
  async signin(
    @Body('email') email: string,
    @Body('password') pass: string,
  ) {
    const result = await this.userService.signin(email, pass);
    return { message: 'Logged in successfully', access_token: result.access_token };
  }

  @Put('update-profile/:id')
  @UseGuards(AuthGuard)
  updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() info: Partial<UserDTO>,
  ): object {
    return this.userService.updateProfile(id, info);
  }

  @Post('upload-document')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
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
    }),
  )
  uploadDocument(@UploadedFile() file: Express.Multer.File): object {
    return this.userService.uploadDocument(file.filename);
  }

  @Post('add-to-cart/:userId')
  @UseGuards(AuthGuard)
  addToCart(@Param('userId', ParseIntPipe) userId: number, @Body() cartData: object): object {
    return this.userService.addToCart(userId, cartData);
  }

  @Patch('update-booking-status/:bookingId')
  @UseGuards(AuthGuard)
  updateBookingStatus(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @Body('status') status: string,
  ): object {
    return this.userService.updateBookingStatus(bookingId, status);
  }

  @Delete('cancel-service/:userId/:bookingId')
  @UseGuards(AuthGuard)
  cancelService(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): object {
    return this.userService.cancelService(bookingId, userId);
  }

  @Get('bookings/:userId')
  @UseGuards(AuthGuard)
  getUserBookings(@Param('userId', ParseIntPipe) userId: number): object {
    return this.userService.getUserBookings(userId);
  }
}

