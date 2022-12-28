import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDTO } from './dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Post('register')
  createUser(@Body() dto: CreateUserDTO) {
    return this.userService.createUser(dto);
  }
}
