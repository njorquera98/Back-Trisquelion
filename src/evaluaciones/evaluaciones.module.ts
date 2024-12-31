import { Module } from '@nestjs/common';
import { EvaluacionesService } from './evaluaciones.service';
import { EvaluacionesController } from './evaluaciones.controller';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Evaluacion } from './entities/evaluacion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bono } from 'src/bonos/entities/bono.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Evaluacion, Paciente, Bono])],
  controllers: [EvaluacionesController],
  providers: [EvaluacionesService],
})
export class EvaluacionesModule { }
