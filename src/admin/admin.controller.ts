import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Put,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminDTO } from './admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from './auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  getHello(): object {
    return this.adminService.getHello();
  }

  @Get('getall')
  getAll(): object {
    return this.adminService.getAll();
  }

  @Get('find/:id')
  getAdminByID(@Param('id', ParseIntPipe) id: number): object {
    return this.adminService.getAdminByID(id);
  }

  @Get('search')
  async searchAdmin(@Query('name') name: string, @Query('id') id: number): Promise<object> {
    return this.adminService.searchAdmin(name, id);
  }

  @Post('add')
  addAdmin(@Body() mydata: AdminDTO): object {
    return this.adminService.addAdmin(mydata);
  }

  @Post('signup')
  signup(@Body() mydata: AdminDTO): object {
    return this.adminService.addAdmin(mydata);
  }

  @Post('signin')
  async signin(@Body() mydto: Partial<AdminDTO>) {
    return await this.adminService.signin(mydto);
  }

  @Get('signout')
  signout() {
    return { message: "logged out (destroy token on client side)" };
  }

  @Patch('status/:id')
  @UseGuards(AuthGuard)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ) {
    return this.adminService.changeStatus(id, status);
  }

  @Get('inactive')
  getInactive() {
    return this.adminService.getInactiveAdmins();
  }

  @Get('older-than-40')
  getOlder() {
    return this.adminService.getOlderAdmins();
  }

  @Post('upload-nid')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|png|jpeg)$/)) cb(null, true);
        else cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
      },
      limits: { fileSize: 2000000 },
      storage: diskStorage({
        destination: './uploads/nid',
        filename: (req, file, cb) => {
          cb(null, Date.now() + extname(file.originalname));
        },
      }),
    }),
  )
  uploadNID(@UploadedFile() file: Express.Multer.File): object {
    return this.adminService.uploadNID(file.filename);
  }

  @Put('update/:id')
  @UseGuards(AuthGuard)
  updateAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() mydata: AdminDTO,
  ): object {
    return this.adminService.updateAdmin(id, mydata);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  deleteAdmin(@Param('id', ParseIntPipe) id: number): object {
    return this.adminService.deleteAdmin(id);
  }

  @Post('activity/:adminId')
  @UseGuards(AuthGuard)
  addActivity(@Param('adminId', ParseIntPipe) adminId: number, @Body('action') action: string) {
    return this.adminService.addAdminActivity(adminId, action);
  }

  @Get('activities/:adminId')
  @UseGuards(AuthGuard)
  getActivities(@Param('adminId', ParseIntPipe) adminId: number) {
    return this.adminService.getAdminActivities(adminId);
  }

  @Delete('activity/:activityId')
  @UseGuards(AuthGuard)
  deleteActivity(@Param('activityId', ParseIntPipe) activityId: number) {
    return this.adminService.deleteAdminActivity(activityId);
  }
}
