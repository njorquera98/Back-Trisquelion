import { Module } from '@nestjs/common';
import { SesionesService } from './sesiones.service';
import { SesionesController } from './sesiones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sesion } from './entities/sesion.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Bono } from 'src/bonos/entities/bono.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sesion, Paciente, Bono])],
  controllers: [SesionesController],
  providers: [SesionesService],
})
export class SesionesModule { }
