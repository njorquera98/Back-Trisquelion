import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReprogramacionSesion } from './entities/reprogramacion.entity';
import { ReprogramacionService } from './reprogramacion.service';
import { ReprogramacionController } from './reprogramacion.controller';
import { Paciente } from 'src/pacientes/entities/paciente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReprogramacionSesion, Paciente])],
  controllers: [ReprogramacionController],
  providers: [ReprogramacionService],
  exports: [ReprogramacionService],
})
export class ReprogramacionModule { }

