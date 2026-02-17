import { Controller, Get, Post, Body, Patch, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Public()
  @Get(':id/profile')
  getHostProfile(@Param('id') id: string) {
    return this.usersService.getHostProfile(id);
  }

  @Patch('me')
  updateProfile(
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAccount(@CurrentUser() user: { id: string }) {
    return this.usersService.deleteAccount(user.id);
  }

  @Get('me/export')
  exportData(@CurrentUser() user: { id: string }) {
    return this.usersService.exportData(user.id);
  }

  @Patch('become-host')
  becomeHost(@CurrentUser() user: { id: string }) {
    return this.usersService.becomeHost(user.id);
  }
}
