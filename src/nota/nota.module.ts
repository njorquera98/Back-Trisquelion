import { Module } from '@nestjs/common';
import { NotaService } from './nota.service';
import { NotaController } from './nota.controller';
import { Nota } from './entities/nota.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from 'src/pacientes/entities/paciente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Nota, Paciente])],
  controllers: [NotaController],
  providers: [NotaService],
})
export class NotaModule { }
