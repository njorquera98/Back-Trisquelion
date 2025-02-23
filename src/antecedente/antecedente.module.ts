import { Module } from '@nestjs/common';
import { AntecedenteService } from './antecedente.service';
import { AntecedenteController } from './antecedente.controller';
import { Antecedente } from './entities/antecedente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from 'src/pacientes/entities/paciente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Antecedente, Paciente])],
  controllers: [AntecedenteController],
  providers: [AntecedenteService],
})
export class AntecedenteModule { }
