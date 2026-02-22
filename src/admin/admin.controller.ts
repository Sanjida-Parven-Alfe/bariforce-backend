import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';

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
  getAdminByID(@Param('id') id: number): object {
    console.log(typeof id);
    return this.adminService.getAdminByID(id);
  }

  @Get('search')
  searchAdmin(@Query('name') name: string, @Query('id') id: number): object {
    return this.adminService.searchAdmin(name, id);
  }

  @Post('add')
  addAdmin(@Body() mydata: object): object {
    return this.adminService.addAdmin(mydata);
  }

  @Put('update/:id')
  updateAdmin(@Param('id') id: number, @Body() mydata: object): object {
    return this.adminService.updateAdmin(id, mydata);
  }

  @Delete('delete/:id')
  deleteAdmin(@Param('id') id: number): object {
    return this.adminService.deleteAdmin(id);
  }
}
