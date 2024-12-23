import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsuarioModule } from '../usuario/usuario.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';  // Asegúrate de importar el controlador

@Module({
  imports: [
    UsuarioModule,
    PassportModule,
    JwtModule.register({
      secret: 'jwt-secret-key', // Cambia esta clave por algo más seguro
      signOptions: { expiresIn: '1h' }, // Token expira en 1 hora
    }),
  ],
  controllers: [AuthController],  // Asegúrate de que AuthController esté aquí
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }

