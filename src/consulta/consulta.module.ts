import { Module } from '@nestjs/common';
import { ConsultaService } from './consulta.service';
import { ConsultaController } from './consulta.controller';
import { Consulta } from './entities/consulta.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medico } from 'src/medico/entities/medico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Consulta, Paciente, Medico])],
  controllers: [ConsultaController],
  providers: [ConsultaService],
})
export class ConsultaModule { }
