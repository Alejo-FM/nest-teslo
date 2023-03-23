import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from "@nestjs/passport";

import { User } from './entities/user.entity';
import { RawHeaders, GetUser, Auth } from './decorators';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login( loginUserDto );
  }

  @Get('check-status')
  @Auth()
  // @UseGuards( AuthGuard() )
  checkAuthStatus(
    @GetUser() user: User,
  ){
    return this.authService.checkAuthStatus( user )
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,

    @RawHeaders() rawHeaders: string[],
  ){

    console.log(request)

    return {
      ok: true,
      message: 'Hola mundo privado',
      user,
      userEmail,
      rawHeaders
    }
  }

  @Get('private2')
  // @SetMetadata('roles', ['admin','super-user'])
  @RoleProtected( ValidRoles.superUser,  )
  @UseGuards( AuthGuard(), UserRoleGuard )
  private2(
    @GetUser() user: User
  ){
    return{
      ok: true,
      user
    }
  }

  @Get('private3')
  // @SetMetadata('roles', ['admin','super-user'])
  @Auth(ValidRoles.admin)
  private3(
    @GetUser() user: User
  ){
    return{
      ok: true,
      user
    }
  }
}
