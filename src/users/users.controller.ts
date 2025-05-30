import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Get('/:id')
  @HttpCode(200)
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Get()
  @HttpCode(200)
  getAll(){
    return this.usersService.getAll();
  }

}
