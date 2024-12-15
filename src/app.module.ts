import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacientesModule } from './pacientes/pacientes.module';
import { SesionesModule } from './sesiones/sesiones.module';

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
      autoLoadEntities: true,
      synchronize: true,
    }),
  }),
    PacientesModule,
    SesionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
