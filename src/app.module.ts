import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacientesModule } from './pacientes/pacientes.module';
import { SesionesModule } from './sesiones/sesiones.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { BonosModule } from './bonos/bonos.module';
import { EvaluacionesModule } from './evaluaciones/evaluaciones.module';
import { HorarioModule } from './horario/horario.module';
import { AsistenciaModule } from './asistencia/asistencia.module';
import { PesoMaximoModule } from './peso-maximo/peso-maximo.module';
import { NotaModule } from './nota/nota.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'mysql',
      host: configService.get('DB_HOST'),
      port: parseInt(configService.get('DB_PORT')),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_DATABASE'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      charset: 'utf8mb4_unicode_ci',
      autoLoadEntities: true,
      synchronize: true,
    }),
  }),
    PacientesModule,
    SesionesModule,
    UsuarioModule,
    BonosModule,
    AuthModule,
    EvaluacionesModule,
    HorarioModule,
    AsistenciaModule,
    PesoMaximoModule,
    NotaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
