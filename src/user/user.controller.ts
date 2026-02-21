import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
 
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
 
  @Get('search-service')
  searchService(@Query('name') name: string): object {
    return this.userService.searchService(name);
  }
 
  @Post('signup')
  createAccount(@Body() data: object): object {
    return this.userService.createAccount(data);
  }
 
  @Put('update-profile/:id')
  updateProfile(@Param('id') id: number, @Body() info: object): object {
    return this.userService.updateProfile(id, info);
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