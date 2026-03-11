import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto } from './user-response.dto';
import { UpdateUserDto } from './update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map(UserResponseDto.from);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(id);
    return UserResponseDto.from(user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, dto);
    return UserResponseDto.from(user);
  }
}
