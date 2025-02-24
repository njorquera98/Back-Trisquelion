import { Module } from '@nestjs/common';
import { FirmaService } from './firma.service';
import { FirmaController } from './firma.controller';
import { Firma } from './entities/firma.entity';
import { Documento } from 'src/documento/entities/documento.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Firma, Documento])],
  controllers: [FirmaController],
  providers: [FirmaService],
})
export class FirmaModule { }
