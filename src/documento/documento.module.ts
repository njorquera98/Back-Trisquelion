import { Module } from '@nestjs/common';
import { DocumentoService } from './documento.service';
import { DocumentoController } from './documento.controller';
import { Documento } from './entities/documento.entity';
import { Consulta } from 'src/consulta/entities/consulta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultaService } from 'src/consulta/consulta.service';
import { PacientesModule } from 'src/pacientes/pacientes.module';
import { MedicoModule } from 'src/medico/medico.module';
import { FirmaService } from 'src/firma/firma.service';
import { Firma } from 'src/firma/entities/firma.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Documento, Consulta, Firma]), PacientesModule, MedicoModule],
  controllers: [DocumentoController],
  providers: [DocumentoService, ConsultaService, FirmaService],
})
export class DocumentoModule { }
