import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from '../usuario/dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() authDto: AuthDto) {
    console.log('Login endpoint hit');  // Verifica si se llega aquí
    return this.authService.login(authDto);
  }

  @Get('test')
  testRoute() {
    return { message: 'Auth route is working' };
  }
}

