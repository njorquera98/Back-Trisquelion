import { Module } from '@nestjs/common';
import { HorarioService } from './horario.service';
import { HorarioController } from './horario.controller';
import { Horario } from './entities/horario.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Horario, Paciente])],
  controllers: [HorarioController],
  providers: [HorarioService],
})
export class HorarioModule { }
