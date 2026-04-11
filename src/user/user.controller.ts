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
  UploadedFile,
  UseGuards,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { extname } from 'path';
import { SessionGuard } from './session.guard';
 
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
 
  @Post('signin')
  async signin(
    @Session() session: Record<string, any>,
    @Body('email') email: string,
    @Body('password') pass: string,
  ) {
    const isMatch = await this.userService.signin(email, pass);
    if (isMatch) {
      session.email = email;
      return { message: 'Logged in successfully' };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
 
  @Get('signout')
  signout(@Session() session: Record<string, any>) {
    session.destroy((err) => {
      if (err) throw new UnauthorizedException('Logout failed');
    });
    return { message: 'Logged out successfully' };
  }
 
  // To simulate authenticated user we would use SessionGuard and grab user info from Session
  // For the sake of matching your frontend parameters, we still accept ID from path here:
  @Put('update-profile/:id')
  @UseGuards(SessionGuard)
  updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() info: Partial<UserDTO>,
  ): object {
    return this.userService.updateProfile(id, info);
  }
 
  @Post('upload-document')
  @UseGuards(SessionGuard)
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
  @UseGuards(SessionGuard)
  addToCart(@Param('userId', ParseIntPipe) userId: number, @Body() cartData: object): object {
    return this.userService.addToCart(userId, cartData);
  }
 
  @Delete('cancel-service/:userId/:bookingId')
  @UseGuards(SessionGuard)
  cancelService(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): object {
    return this.userService.cancelService(bookingId, userId);
  }
 
  @Get('bookings/:userId')
  @UseGuards(SessionGuard)
  getUserBookings(@Param('userId', ParseIntPipe) userId: number): object {
    return this.userService.getUserBookings(userId);
  }
}
 
