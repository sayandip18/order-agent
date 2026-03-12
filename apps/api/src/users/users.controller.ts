import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto } from './user-response.dto';
import { UpdateUserDto } from './update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => UserResponseDto.from(user));
  }

  @Get('by-email/:email')
  async findByEmail(
    @Param('email') email: string,
  ): Promise<UserResponseDto | null> {
    const user = await this.usersService.findByEmail(email);
    return user ? UserResponseDto.from(user) : null;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return UserResponseDto.from(user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, dto);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return UserResponseDto.from(user);
  }
}
