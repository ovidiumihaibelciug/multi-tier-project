import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/auth/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @Public()
  // @Post('login')
  // async login(
  //   @Body() loginDto: LoginUserDto,
  //   @Res({ passthrough: true }) response: Response,
  // ) {
  //   const { accessToken } = await this.usersService.login({
  //     email: loginDto.email,
  //     password: loginDto.password,
  //   });

  //   // response.cookie('access_token', accessToken, {
  //   //   httpOnly: true,
  //   //   secure: false,
  //   //   sameSite: 'none',
  //   //   maxAge: 60 * 60 * 1000, // 1 hour
  //   // });

  //   return { message: 'Login successful', access_token: accessToken };
  // }
  @Get()
  async findAll(@Query() query: { type: string }) {
    if (query.type) {
      return this.usersService.findByType(query.type);
    }
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post('find')
  async findUser(@Body('identifier') identifier: string) {
    const user = await this.usersService.findUserByIdentifier(identifier);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
