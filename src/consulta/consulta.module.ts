import { Module } from '@nestjs/common';
import { ConsultaService } from './consulta.service';
import { ConsultaController } from './consulta.controller';
import { Consulta } from './entities/consulta.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Consulta, Paciente])],
  controllers: [ConsultaController],
  providers: [ConsultaService],
})
export class ConsultaModule { }
