import { Module } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { AsistenciaController } from './asistencia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asistencia } from './entities/asistencia.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Horario } from 'src/horario/entities/horario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asistencia, Paciente, Horario])],
  controllers: [AsistenciaController],
  providers: [AsistenciaService],
})
export class AsistenciaModule { }
